import logging
import csv
import io
import os
import json
from uuid import UUID, uuid4
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session

from app.models.ingestion_template import IngestionTemplate
from app.models.product_model import Product, ProductVariant

# Import underlying hierarchy and master models
from app.models.business_category_model import BusinessCategory
from app.models.department_model import Department
from app.models.category_model import Category
from app.models.sub_category_model import SubCategory
from app.models.product_type_model import ProductType
from app.models.brand_model import Brand
from app.models.supplier_model import Supplier
from app.models.material_model import Material
from app.models.color_model import Color
from app.models.size_model import Size
from datetime import datetime

timestamp = datetime.now().strftime("%Y%m%d_%H")
# --- Dedicated Ingestion File Logger Configuration ---
logger = logging.getLogger("ingestion_engine")
logger.setLevel(logging.INFO)

# Ensure the log directory exists safely inside the workspace container
LOG_FILE_PATH = f"/app/logs/bulk_ingestion_{timestamp}.log"
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

# Add File Handler if handlers aren't already attached (prevents duplicate bindings)
if not logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE_PATH, encoding="utf-8")
    file_formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)
    
    # Optional: Keep terminal console streaming enabled alongside the log file
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(file_formatter)
    logger.addHandler(console_handler)
    
    logger.propagate = False

class SmartMdmEngine:

    @staticmethod
    def calculate_header_match(csv_headers: List[str], saved_mapping: Dict[str, str]) -> float:
        """Calculates matching ratio of incoming CSV headers against an existing template mapping template."""
        saved_headers = [h.strip().lower() for h in saved_mapping.keys()]
        if not saved_headers:
            return 0.0
        matches = sum(1 for h in csv_headers if h.strip().lower() in saved_headers)
        return (matches / max(len(csv_headers), len(saved_headers))) * 100.0

    @classmethod
    def find_matching_template(cls, db: Session, csv_headers: List[str]) -> Tuple[Optional[IngestionTemplate], float]:
        """Finds best mapping template based on exact match priority or a >=90% fallback match."""
        templates = db.query(IngestionTemplate).filter(IngestionTemplate.is_active == True).all()
        best_template = None
        best_score = 0.0

        for t in templates:
            score = cls.calculate_header_match(csv_headers, t.column_mapping)
            if score == 100.0:
                return t, 100.0
            if score >= 90.0 and score > best_score:
                best_score = score
                best_template = t

        return best_template, best_score

    @classmethod
    def process_bytes_in_background(cls, db_session_factory, file_bytes: bytes, column_map: Dict[str, str]):
        """Decodes file bytes to string and processes rows safely away from the main thread loop."""
        try:
            csv_content = file_bytes.decode("utf-8")
            cls.process_csv_rows_task(db_session_factory, csv_content, column_map)
        except Exception as err:
            logger.error(f"Fatal background parsing worker initialization exception: {str(err)}")

    @classmethod
    def resolve_master_entity(cls, db: Session, model_cls: Any, name_field: str, value: str, fallback_fields: Dict[str, Any] = None, default_fallback: str = "Unknown") -> UUID:
        """Finds or creates an individual master metadata node dynamically using flush transaction bounds."""
        clean_val = str(value or "").strip()
        if not clean_val:
            clean_val = default_fallback
            
        entity = db.query(model_cls).filter(getattr(model_cls, name_field) == clean_val).first()
        if not entity:
            params = {name_field: clean_val}
            if fallback_fields:
                params.update(fallback_fields)
            elif hasattr(model_cls, f"{name_field.replace('_name', '')}_description"):
                desc_field = f"{name_field.replace('_name', '')}_description"
                params[desc_field] = "Auto-generated dynamically by the Smart MDM Engine."
            elif hasattr(model_cls, "product_type_description"):
                params["product_type_description"] = "Auto-generated dynamically by the Smart MDM Engine."
                
            entity = model_cls(**params)
            db.add(entity)
            db.flush()  # ✅ Atomic write to generate UUID inside open transaction bounds
            logger.info(f"   [MASTER CREATED] Model: {model_cls.__name__} | Name: '{clean_val}' -> ID: {getattr(entity, model_cls.__tablename__ + '_id')}")
        else:
            logger.info(f"   [MASTER RESOLVED] Model: {model_cls.__name__} | Name: '{clean_val}' -> ID: {getattr(entity, model_cls.__tablename__ + '_id')}")
            
        return getattr(entity, f"{model_cls.__tablename__}_id")

    @classmethod
    def process_csv_rows_task(cls, db_session_factory, csv_content: str, column_map: Dict[str, str]):
        """Parses rows, builds taxonomy master records step-by-step, and links items to file stream logs."""
        db: Session = db_session_factory()
        success_count = 0
        failure_count = 0

        logger.info("======================================================================")
        logger.info("⚡ INGESTION PIPELINE STARTED ⚡")
        logger.info(f"Target Column Mapping: {json.dumps(column_map, indent=2)}")
        logger.info("======================================================================")

        try:
            f = io.StringIO(csv_content)
            reader = csv.DictReader(f)
            
            # Normalize column map keys for robust case-insensitive lookup
            normalized_column_map = {k.strip().lower(): v for k, v in column_map.items()}

            for index, raw_row in enumerate(reader, start=1):
                # Safely normalize the row keys to avoid whitespace or casing issues
                clean_row = {str(k).strip().lower(): str(v).strip() for k, v in raw_row.items() if k is not None}
                
                # Fetch SKU safely
                sku_val = clean_row.get('sku', clean_row.get('vendor_sku', 'UNKNOWN'))
                logger.info(f"--- [ROW #{index}] Processing SKU: {sku_val} ---")
                
                try:
                    normalized_row = {}
                    # Build normalized row using the case-insensitive normalized column mapping
                    for file_header_lower, target_field in normalized_column_map.items():
                        if file_header_lower in clean_row:
                            normalized_row[target_field] = clean_row[file_header_lower]

                    # Retrieve unique product key (SKU)
                    sku = normalized_row.get("sku") or clean_row.get("sku") or clean_row.get("vendor_sku")
                    if not sku:
                        logger.warning(f"❌ [Row #{index}] Skipped: Missing unique SKU column alignment.")
                        failure_count += 1
                        continue

                    normalized_row["sku"] = sku.strip()

                    existing_product = db.query(Product).filter(Product.sku == normalized_row["sku"]).first()
                    if existing_product:
                        logger.warning(f"⚠️ [Row #{index}] Skipped: SKU '{normalized_row['sku']}' already exists.")
                        failure_count += 1
                        continue

                    # Helper to cleanly extract mapped master names, falling back to None instead of empty strings
                    def get_mapped_val(*fields: str) -> Optional[str]:
                        for f in fields:
                            val = normalized_row.get(f)
                            if val and val.strip():
                                return val.strip()
                        return None

                    # 1. Resolve 5-Tier Taxonomy Hierarchy Loop
                    logger.info("   -> Resolving Taxonomy Masters...")
                    bc_id = cls.resolve_master_entity(
                        db, BusinessCategory, "business_category_name", 
                        get_mapped_val("business_category_name", "business_category", "biz_group"),
                        default_fallback="General"
                    )
                    dept_id = cls.resolve_master_entity(
                        db, Department, "department_name", 
                        get_mapped_val("department_name", "department", "dept_code"), 
                        {"business_category_id": bc_id},
                        default_fallback="General"
                    )
                    cat_id = cls.resolve_master_entity(
                        db, Category, "category_name", 
                        get_mapped_val("category_name", "category", "division"),
                        default_fallback="General"
                    )
                    sub_cat_id = cls.resolve_master_entity(
                        db, SubCategory, "sub_category_name", 
                        get_mapped_val("sub_category_name", "sub_category", "sub_group"),
                        default_fallback="General"
                    )
                    pt_id = cls.resolve_master_entity(
                        db, ProductType, "product_type", 
                        get_mapped_val("product_type", "style_type"),
                        default_fallback="Standard"
                    )

                    # 2. Resolve Core Master Entities (Brand, Supplier, Material)
                    logger.info("   -> Resolving Core Masters...")
                    brand_id = cls.resolve_master_entity(
                        db, Brand, "brand_name", 
                        get_mapped_val("brand_name", "brand"),
                        default_fallback="Generic"
                    )
                    supplier_id = cls.resolve_master_entity(
                        db, Supplier, "supplier_name", 
                        get_mapped_val("supplier_name", "supplier", "vendor"), 
                        {"supplier_code": f"SUPP-{uuid4().hex[:6].upper()}"},
                        default_fallback="Generic Supplier"
                    )
                    material_id = cls.resolve_master_entity(
                        db, Material, "material_name", 
                        get_mapped_val("material_name", "material", "fabric"),
                        default_fallback="Standard"
                    )

                    # 3. Resolve Variant Attribute Identifiers
                    logger.info("   -> Resolving Attribute Masters...")
                    color_id = cls.resolve_master_entity(
                        db, Color, "color_name", 
                        get_mapped_val("color_name", "color"),
                        default_fallback="Default Color"
                    )
                    size_id = cls.resolve_master_entity(
                        db, Size, "size_name", 
                        get_mapped_val("size_name", "size", "size_dimensions"),
                        default_fallback="Standard Size"
                    )

                    # 4. Provision Core Enterprise Product Record
                    logger.info("   -> Inserting Product entity...")
                    new_product = Product(
                        sku=normalized_row["sku"],
                        product_name=get_mapped_val("product_name", "name", "item_title") or f"Product-{normalized_row['sku']}",
                        upc_ean=get_mapped_val("upc_ean", "barcode_ean", "barcode"),
                        short_description=get_mapped_val("short_description", "description", "brief_desc"),
                        long_description=get_mapped_val("long_description", "detailed_description"),
                        barcode=get_mapped_val("barcode", "barcode_ean"),
                        min_order_qty=int(normalized_row.get("min_order_qty") or clean_row.get("min_order") or 1),
                        weight=float(normalized_row["weight"]) if normalized_row.get("weight") else (float(clean_row["item_weight"]) if clean_row.get("item_weight") else None),
                        dimensions=get_mapped_val("dimensions", "size_dimensions"),
                        uom=get_mapped_val("uom", "unit_type") or "Pcs",
                        cost_price=float(normalized_row.get("cost_price") or clean_row.get("cost") or 0.0),
                        selling_price=float(normalized_row.get("selling_price") or clean_row.get("retail_price") or 0.0),
                        stock_qty=int(normalized_row.get("stock_qty") or clean_row.get("initial_qty") or 0),
                        business_category_id=bc_id,
                        department_id=dept_id,
                        category_id=cat_id,
                        sub_category_id=sub_cat_id,
                        product_type_id=pt_id,
                        brand_id=brand_id,
                        supplier_id=supplier_id,
                        material_id=material_id
                    )
                    db.add(new_product)
                    db.flush()

                    # 5. Provision Child Product Variant Record
                    logger.info("   -> Provisioning Variant details...")
                    new_variant = ProductVariant(
                        product_id=new_product.product_id,
                        color_id=color_id,
                        size_id=size_id,
                        product_images=[]
                    )
                    db.add(new_variant)
                    
                    success_count += 1
                    logger.info(f"✅ [Row #{index}] Successfully imported Product (ID: {new_product.product_id}) and Variant.")

                    if success_count % 100 == 0:
                        db.commit()
                        logger.info("💾 Chunk batch transaction committed successfully to database storage.")

                except Exception as row_err:
                    db.rollback()
                    logger.error(f"❌ [Row #{index}] Failed to import. Rollback completed. Error: {str(row_err)}")
                    failure_count += 1

            db.commit()
        except Exception as global_err:
            db.rollback()
            logger.error(f"🚨 Fatal exception raised in CSV reader thread: {str(global_err)}")
        finally:
            db.close()
            logger.info("======================================================================")
            logger.info("🏁 INGESTION PIPELINE FINISHED 🏁")
            logger.info(f"Results -> Saved: {success_count} | Failed: {failure_count}")
            logger.info(f"Log file written to: {LOG_FILE_PATH}")
            logger.info("======================================================================")
import logging
from uuid import UUID
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks, HTTPException

from app.models.product_model import Product, ProductVariant
from app.models.product_type_model import ProductType
from app.models.sub_category_model import SubCategory
# Assume other models (BusinessCategory, Department, Category) are imported here

logger = logging.getLogger(__name__)

class BulkIngestionEngine:

    @staticmethod
    def resolve_taxonomy_chain(db: Session, row: Dict[str, Any]) -> Dict[str, UUID]:
        """
        Iterates through the 5-tier taxonomy structure. If a text description name 
        does not exist, it inserts it instantly to ensure full cascade tracking integrity.
        """
        # --- Example layout handling for a node segment (e.g., Sub-Category) ---
        sub_cat_name = str(row.get("sub_category_name", "")).strip()
        
        # 1. Fetch or create missing sub-category
        sub_cat = db.query(SubCategory).filter(SubCategory.sub_category_name == sub_cat_name).first()
        if not sub_cat:
            sub_cat = SubCategory(
                sub_category_name=sub_cat_name,
                sub_category_description="Auto-generated via bulk data import channel stream."
            )
            db.add(sub_cat)
            db.commit()
            db.refresh(sub_cat)

        # Repeat this structure down the chain to build a full cascading hierarchy map...
        # Returns resolved UUID dictionary keys required by the main product table rows
        return {
            "business_category_id": row["resolved_bc_id"],
            "department_id": row["resolved_dept_id"],
            "category_id": row["resolved_cat_id"],
            "sub_category_id": sub_cat.sub_category_id,
            "product_type_id": row["resolved_pt_id"]
        }

    @classmethod
    def process_csv_rows_task(cls, db_session_factory, raw_rows: List[Dict[str, Any]], column_map: Dict[str, str]):
        """
        Runs inside an asynchronous background executor thread. Parses row elements,
        resolves entity foreign keys, and inserts master data tracking sets cleanly.
        """
        db: Session = db_session_factory()
        success_count = 0
        failure_count = 0

        for index, raw_row in enumerate(raw_rows):
            try:
                # Map raw headers to standardized DB fields using the template schema configuration
                normalized_row = {column_map[k]: v for k, v in raw_row.items() if k in column_map}
                
                # Resolve the structural 5-tier chain lookups
                taxonomy_ids = cls.resolve_taxonomy_chain(db, normalized_row)

                # Check if SKU identifier entry exists to prevent collisions
                existing_product = db.query(Product).filter(Product.sku == normalized_row.get("sku")).first()
                if existing_product:
                    logger.warning(f"Row {index}: SKU {normalized_row.get('sku')} already exists. Skipping entry line.")
                    failure_count += 1
                    continue

                # Build master product context profile tracking model
                new_product = Product(
                    sku=normalized_row["sku"],
                    product_name=normalized_row["product_name"],
                    upc_ean=normalized_row.get("upc_ean"),
                    short_description=normalized_row.get("short_description"),
                    long_description=normalized_row.get("long_description"),
                    barcode=normalized_row.get("barcode"),
                    min_order_qty=int(normalized_row.get("min_order_qty", 1)),
                    weight=float(normalized_row["weight"]) if normalized_row.get("weight") else None,
                    dimensions=normalized_row.get("dimensions"),
                    uom=normalized_row.get("uom"),
                    cost_price=float(normalized_row["cost_price"]),
                    selling_price=float(normalized_row["selling_price"]),
                    **taxonomy_ids
                )
                db.add(new_product)
                db.flush() # Yields generated product_id UUID context properties instantly

                # Provision associated baseline default variation block mapping fields
                new_variant = ProductVariant(
                    product_id=new_product.product_id,
                    stock_qty=int(normalized_row.get("stock_qty", 0)),
                    # Variant attribute assignments look up matching UUID nodes for color/size properties
                    color_id=None, 
                    size_id=None,
                    product_images=[]
                )
                db.add(new_variant)
                success_count += 1

                # Periodic chunk optimization commits
                if success_count % 100 == 0:
                    db.commit()

            except Exception as row_error:
                db.rollback()
                logger.error(f"Error processing row matrix index line {index}: {str(row_error)}")
                failure_count += 1

        db.commit()
        db.close()
        logger.info(f"Bulk ingestion ingestion completed. Added: {success_count}, Skipped/Failed: {failure_count}")
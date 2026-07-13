import os
import json
import shutil
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.product_model import Product, ProductVariant
from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductVariantUpdate, ProductResponseData

UPLOAD_DIR = os.path.join("static", "uploads", "products")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ProductService:

    @staticmethod
    def save_local_file(file: UploadFile) -> str:
        try:
            unique_filename = f"{uuid4()}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            return f"/static/uploads/products/{unique_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to persist file: {str(e)}")

    @staticmethod
    def remove_local_file(file_relative_path: str) -> None:
        try:
            filename = os.path.basename(file_relative_path)
            target_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(target_path):
                os.remove(target_path)
        except Exception as e:
            print(f"Non-blocking cleanup error: {str(e)}")

    # =========================================================================
    # 📦 CORE PRODUCT CRUD METHODS
    # =========================================================================

    @staticmethod
    def get_all_products(db: Session, limit: int = 100, offset: int = 0, is_active: Optional[bool] = None, search: Optional[str] = None) -> List[ProductResponseData]:
        query = db.query(Product).options(
    joinedload(Product.variants).joinedload(ProductVariant.color),
    joinedload(Product.variants).joinedload(ProductVariant.size)
)
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(or_(
                Product.product_name.ilike(search_filter), 
                Product.sku.ilike(search_filter), 
                Product.barcode.ilike(search_filter)
            ))
        db_products = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()
        return [ProductResponseData.model_validate(p) for p in db_products]

    @staticmethod
    def get_product_by_id(db: Session, product_id: UUID) -> ProductResponseData:
        product = db.query(Product).options(
            joinedload(Product.variants).joinedload(ProductVariant.color),
            joinedload(Product.variants).joinedload(ProductVariant.size)
        ).filter(Product.product_id == product_id).first()        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' could not be located.")
        return ProductResponseData.model_validate(product)

    @staticmethod
    def create_product(
        db: Session, 
        product_in: ProductCreate, 
        color_id: Optional[UUID], 
        size_id: Optional[UUID], 
        image_files: List[UploadFile], 
        current_user_id: Optional[UUID] = None
    ) -> ProductResponseData:
        sku_exists = db.query(Product).filter(Product.sku == product_in.sku).first()
        if sku_exists:
            raise HTTPException(status_code=400, detail=f"A product record using SKU designation '{product_in.sku}' already exists.")

        saved_file_paths = []
        try:
            for file in image_files:
                if file.filename:
                    saved_path = ProductService.save_local_file(file)
                    saved_file_paths.append(saved_path)

            product_data = product_in.model_dump()
            new_product = Product(**product_data)
            new_product.created_by = current_user_id

            new_variant = ProductVariant(
                color_id=color_id,
                size_id=size_id,
                product_images=saved_file_paths
            )
            new_product.variants.append(new_variant)

            db.add(new_product)
            db.commit()
            
            return ProductService.get_product_by_id(db, new_product.product_id)

        except Exception as e:
            db.rollback()
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=f"Transaction context aborted: {str(e)}")

    @staticmethod
    def update_product(db: Session, product_id: UUID, product_in: ProductUpdate, current_user_id: Optional[UUID] = None) -> ProductResponseData:
        # Fetch the raw DB entry to make alterations directly
        product = db.query(Product).options(joinedload(Product.variants)).filter(Product.product_id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product could not be located.")

        if product_in.sku and product_in.sku != product.sku:
            if db.query(Product).filter(Product.sku == product_in.sku).first():
                raise HTTPException(status_code=400, detail="SKU parameter modification reference is taken.")
        try:
            update_data = product_in.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(product, field, value)
            product.modified_at = datetime.utcnow()
            product.modified_by = current_user_id
            db.commit()
            
            return ProductService.get_product_by_id(db, product.product_id)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def delete_product(db: Session, product_id: UUID) -> None:
        product = db.query(Product).options(joinedload(Product.variants)).filter(Product.product_id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product could not be located.")

        all_variant_images = []
        for variant in product.variants:
            if variant.product_images:
                # Handle raw string values if not yet parsed cleanly during deletion cleanup
                if isinstance(variant.product_images, str):
                    try:
                        images = json.loads(variant.product_images)
                        all_variant_images.extend(images)
                    except Exception:
                        all_variant_images.append(variant.product_images)
                else:
                    all_variant_images.extend(variant.product_images)
                
        try:
            db.delete(product)
            db.commit()
            for image_path in all_variant_images:
                ProductService.remove_local_file(image_path)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    # =========================================================================
    # 🔀 INDEPENDENT PRODUCT VARIANT CRUD METHODS
    # =========================================================================

    @staticmethod
    def create_variant(
        db: Session,
        product_id: UUID,
        color_id: Optional[UUID],
        size_id: Optional[UUID],
        image_files: List[UploadFile]
    ) -> ProductResponseData:
        # Check if parent product exists
        product = db.query(Product).filter(Product.product_id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Parent product could not be located.")

        saved_file_paths = []
        try:
            for file in image_files:
                if file.filename:
                    saved_path = ProductService.save_local_file(file)
                    saved_file_paths.append(saved_path)

            new_variant = ProductVariant(
                product_id=product_id,
                color_id=color_id,
                size_id=size_id,
                product_images=saved_file_paths
            )
            db.add(new_variant)
            db.commit()
            return ProductService.get_product_by_id(db, product_id)
        except Exception as e:
            db.rollback()
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=f"Failed to create variant: {str(e)}")

    @staticmethod
    def update_variant(
        db: Session,
        variant_id: UUID,
        variant_in: ProductVariantUpdate,
        image_files: Optional[List[UploadFile]] = None
    ) -> ProductResponseData:
        variant = db.query(ProductVariant).filter(ProductVariant.product_variant_id == variant_id).first()
        if not variant:
            raise HTTPException(status_code=404, detail="Variant could not be located.")

        saved_file_paths = []
        try:
            # Update fields
            variant.color_id = variant_in.color_id
            variant.size_id = variant_in.size_id

            # If new files are uploaded, append them to the existing list
            if image_files:
                for file in image_files:
                    if file.filename:
                        saved_path = ProductService.save_local_file(file)
                        saved_file_paths.append(saved_path)
                
                # Merge new image paths into current list safely
                current_images = variant.product_images if isinstance(variant.product_images, list) else []
                variant.product_images = current_images + saved_file_paths

            db.commit()
            return ProductService.get_product_by_id(db, variant.product_id)
        except Exception as e:
            db.rollback()
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def delete_variant(db: Session, variant_id: UUID) -> UUID:
        variant = db.query(ProductVariant).filter(ProductVariant.product_variant_id == variant_id).first()
        if not variant:
            raise HTTPException(status_code=404, detail="Variant could not be located.")

        parent_product_id = variant.product_id
        all_images = []
        if variant.product_images:
            if isinstance(variant.product_images, str):
                try:
                    all_images = json.loads(variant.product_images)
                except Exception:
                    all_images = [variant.product_images]
            else:
                all_images = variant.product_images

        try:
            db.delete(variant)
            db.commit()
            for path in all_images:
                ProductService.remove_local_file(path)
            return parent_product_id
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
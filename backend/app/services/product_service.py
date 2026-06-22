import os
import shutil
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product_model import Product, ProductVariant
from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductVariantUpdate


# Local configurations for directory file persistence
UPLOAD_DIR = os.path.join("static", "uploads", "products")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ProductService:

    @staticmethod
    def save_local_file(file: UploadFile) -> str:
        """Helper logic to write binary file data onto local disk filesystem safely."""
        try:
            unique_filename = f"{uuid4()}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Returns a clean static string endpoint route serving format
            return f"/static/uploads/products/{unique_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to persist file locally on server storage disk: {str(e)}")

    @staticmethod
    def remove_local_file(file_relative_path: str) -> None:
        """Helper logic to eliminate static media files from server storage when dropped."""
        try:
            # Reconstruct absolute filepath context
            filename = os.path.basename(file_relative_path)
            target_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(target_path):
                os.remove(target_path)
        except Exception as e:
            # Non-blocking log catch to prevent thread interruption
            print(f"Non-blocking cleanup error: Unable to purge local file asset {file_relative_path}: {str(e)}")

    # =========================================================================
    # 📦 CORE PRODUCT CRUD METHODS
    # =========================================================================

    @staticmethod
    def get_all_products(db: Session, limit: int = 100, offset: int = 0, is_active: Optional[bool] = None, search: Optional[str] = None) -> List[Product]:
        query = db.query(Product)
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(or_(Product.product_name.ilike(search_filter), Product.sku.ilike(search_filter), Product.barcode.ilike(search_filter)))
        return query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_product_by_id(db: Session, product_id: UUID) -> Product:
        product = db.query(Product).filter(Product.product_id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' could not be located.")
        return product

    @staticmethod
    def create_product(
        db: Session, 
        product_in: ProductCreate, 
        color_id: Optional[UUID], 
        size_id: Optional[UUID], 
        image_files: List[UploadFile], 
        current_user_id: Optional[UUID] = None
    ) -> Product:
        """Creates product and parses multi-part local file arrays directly inside transaction bounds."""
        sku_exists = db.query(Product).filter(Product.sku == product_in.sku).first()
        if sku_exists:
            raise HTTPException(status_code=400, detail=f"A product record using SKU designation '{product_in.sku}' already exists.")

        saved_file_paths = []
        try:
            # 1. Process files into storage folder structures
            for file in image_files:
                if file.filename: # check for real multi-part allocations
                    saved_path = ProductService.save_local_file(file)
                    saved_file_paths.append(saved_path)

            # 2. Build core entity structures
            product_data = product_in.model_dump()
            new_product = Product(**product_data)
            new_product.created_by = current_user_id

            # 3. Inject initial mandatory baseline variant
            new_variant = ProductVariant(
                color_id=color_id,
                size_id=size_id,
                product_images=saved_file_paths
            )
            new_product.variants.append(new_variant)

            db.add(new_product)
            db.commit()
            db.refresh(new_product)
            return new_product

        except Exception as e:
            db.rollback()
            # Trash any successfully copied files immediately if transaction rolls back
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=f"Transaction context aborted: {str(e)}")

    @staticmethod
    def update_product(db: Session, product_id: UUID, product_in: ProductUpdate, current_user_id: Optional[UUID] = None) -> Product:
        product = ProductService.get_product_by_id(db, product_id)
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
            db.refresh(product)
            return product
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def delete_product(db: Session, product_id: UUID) -> None:
        """Deletes product and scrubs all nested files matching children variants off your system."""
        product = ProductService.get_product_by_id(db, product_id)
        
        # Keep references to image asset file loops for disk purge context later
        all_variant_images = []
        for variant in product.variants:
            if variant.product_images:
                all_variant_images.extend(variant.product_images)
                
        try:
            db.delete(product)
            db.commit()
            
            # File disk scrapper process execution stage
            for image_path in all_variant_images:
                ProductService.remove_local_file(image_path)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    # =========================================================================
    # 🧬 INDEPENDENT PRODUCT VARIANT CRUD METHODS
    # =========================================================================

    @staticmethod
    def get_product_variant_by_id(db: Session, product_variant_id: UUID) -> ProductVariant:
        variant = db.query(ProductVariant).filter(ProductVariant.product_variant_id == product_variant_id).first()
        if not variant:
            raise HTTPException(status_code=404, detail="Product Variant could not be found.")
        return variant

    @staticmethod
    def create_product_variant(db: Session, product_id: UUID, color_id: Optional[UUID], size_id: Optional[UUID], image_files: List[UploadFile]) -> ProductVariant:
        ProductService.get_product_by_id(db, product_id)
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
            db.refresh(new_variant)
            return new_variant
        except Exception as e:
            db.rollback()
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def update_product_variant(db: Session, product_variant_id: UUID, variant_in: ProductVariantUpdate, image_files: Optional[List[UploadFile]] = None) -> ProductVariant:
        """Updates variant properties and allows appending or replacing media streams seamlessly."""
        variant = ProductService.get_product_variant_by_id(db, product_variant_id)
        saved_file_paths = []
        try:
            update_data = variant_in.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(variant, field, value)

            # If new files are passed, append them cleanly to the existing array list
            if image_files:
                for file in image_files:
                    if file.filename:
                        saved_path = ProductService.save_local_file(file)
                        saved_file_paths.append(saved_path)
                
                # Merge lists together
                current_images = list(variant.product_images) if variant.product_images else []
                current_images.extend(saved_file_paths)
                variant.product_images = current_images

            db.commit()
            db.refresh(variant)
            return variant
        except Exception as e:
            db.rollback()
            for path in saved_file_paths:
                ProductService.remove_local_file(path)
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def delete_product_variant(db: Session, product_variant_id: UUID) -> None:
        variant = ProductService.get_product_variant_by_id(db, product_variant_id)
        parent_product = variant.product
        
        if parent_product and len(parent_product.variants) <= 1:
            raise HTTPException(status_code=400, detail="Aborted. Products must retain at least one variation layout profile.")
            
        cached_images = list(variant.product_images) if variant.product_images else []
        try:
            db.delete(variant)
            db.commit()
            for path in cached_images:
                ProductService.remove_local_file(path)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
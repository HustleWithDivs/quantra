from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product_type_model import ProductType
from app.models.sub_category_model import SubCategory, SubCategoryProductType
from app.schemas.product_type_schema import ProductTypeCreate, ProductTypeUpdate


class ProductTypeService:
    @staticmethod
    def get_all_product_types(
        db: Session,
        limit: int = 100,
        offset: int = 0,
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[ProductType]:
        query = db.query(ProductType)

        if is_active is not None:
            query = query.filter(ProductType.is_active == is_active)

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    ProductType.product_type.ilike(search_filter),
                    ProductType.product_type_description.ilike(search_filter),
                )
            )

        return query.order_by(ProductType.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_product_type_by_id(db: Session, product_type_id: UUID) -> ProductType:
        product_type_rec = db.query(ProductType).filter(ProductType.product_type_id == product_type_id).first()
        if not product_type_rec:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product Type with ID '{product_type_id}' could not be found."
            )
        return product_type_rec

    @staticmethod
    def create_product_type(db: Session, product_type_in: ProductTypeCreate, current_user_id: Optional[UUID] = None) -> ProductType:
        existing = db.query(ProductType).filter(ProductType.product_type == product_type_in.product_type).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A product type with the designation '{product_type_in.product_type}' already exists."
            )

        try:
            new_product_type = ProductType(
                product_type=product_type_in.product_type,
                product_type_description=product_type_in.product_type_description,
                is_active=product_type_in.is_active,
                created_by=current_user_id
            )

            if product_type_in.sub_category_ids:
                subcategories = db.query(SubCategory).filter(SubCategory.sub_category_id.in_(product_type_in.sub_category_ids)).all()
                if len(subcategories) != len(product_type_in.sub_category_ids):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="One or more specified Parent SubCategory IDs are invalid."
                    )
                new_product_type.sub_categories = subcategories

            db.add(new_product_type)
            db.commit()
            db.refresh(new_product_type)
            return new_product_type

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create product type record: {str(e)}"
            )

    @staticmethod
    def update_product_type(db: Session, product_type_id: UUID, product_type_in: ProductTypeUpdate, current_user_id: Optional[UUID] = None) -> ProductType:
        product_type_rec = ProductTypeService.get_product_type_by_id(db, product_type_id)

        if product_type_in.product_type and product_type_in.product_type != product_type_rec.product_type:
            existing = db.query(ProductType).filter(ProductType.product_type == product_type_in.product_type).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product Type string configuration name '{product_type_in.product_type}' is already taken."
                )

        try:
            update_data = product_type_in.model_dump(exclude_unset=True)

            if "sub_category_ids" in update_data:
                sc_ids = update_data.pop("sub_category_ids")
                if sc_ids is not None:
                    subcategories = db.query(SubCategory).filter(SubCategory.sub_category_id.in_(sc_ids)).all()
                    if len(subcategories) != len(sc_ids):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="One or more provided Parent SubCategory IDs do not exist."
                        )
                    product_type_rec.sub_categories = subcategories

            for field, value in update_data.items():
                setattr(product_type_rec, field, value)

            product_type_rec.modified_at = datetime.utcnow()
            product_type_rec.modified_by = current_user_id

            db.commit()
            db.refresh(product_type_rec)
            return product_type_rec

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to synchronize product type modifications: {str(e)}"
            )

    @staticmethod
    def delete_product_type(db: Session, product_type_id: UUID) -> None:
        product_type_rec = ProductTypeService.get_product_type_by_id(db, product_type_id)
        try:
            db.delete(product_type_rec)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database execution layer exception occurred: {str(e)}"
            )
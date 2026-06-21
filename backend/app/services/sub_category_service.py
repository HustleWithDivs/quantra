from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.sub_category_model import SubCategory, CategorySubCategory
from app.models.category_model import Category
from app.schemas.sub_category_schema import SubCategoryCreate, SubCategoryUpdate


class SubCategoryService:
    @staticmethod
    def get_all_sub_categories(
        db: Session,
        limit: int = 100,
        offset: int = 0,
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[SubCategory]:
        query = db.query(SubCategory)

        if is_active is not None:
            query = query.filter(SubCategory.is_active == is_active)

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    SubCategory.sub_category_name.ilike(search_filter),
                    SubCategory.sub_category_description.ilike(search_filter),
                )
            )

        return query.order_by(SubCategory.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_sub_category_by_id(db: Session, sub_category_id: UUID) -> SubCategory:
        sub_category = db.query(SubCategory).filter(SubCategory.sub_category_id == sub_category_id).first()
        if not sub_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"SubCategory with ID '{sub_category_id}' could not be found."
            )
        return sub_category

    @staticmethod
    def create_sub_category(db: Session, sub_category_in: SubCategoryCreate, current_user_id: Optional[UUID] = None) -> SubCategory:
        existing = db.query(SubCategory).filter(SubCategory.sub_category_name == sub_category_in.sub_category_name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A subcategory with the name '{sub_category_in.sub_category_name}' already exists."
            )

        try:
            new_sub_category = SubCategory(
                sub_category_name=sub_category_in.sub_category_name,
                sub_category_description=sub_category_in.sub_category_description,
                is_active=sub_category_in.is_active,
                created_by=current_user_id
            )

            if sub_category_in.category_ids:
                categories = db.query(Category).filter(Category.category_id.in_(sub_category_in.category_ids)).all()
                if len(categories) != len(sub_category_in.category_ids):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="One or more specified Parent Category IDs are invalid."
                    )
                new_sub_category.categories = categories

            db.add(new_sub_category)
            db.commit()
            db.refresh(new_sub_category)
            return new_sub_category

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create subcategory entity: {str(e)}"
            )

    @staticmethod
    def update_sub_category(db: Session, sub_category_id: UUID, sub_category_in: SubCategoryUpdate, current_user_id: Optional[UUID] = None) -> SubCategory:
        sub_category = SubCategoryService.get_sub_category_by_id(db, sub_category_id)

        if sub_category_in.sub_category_name and sub_category_in.sub_category_name != sub_category.sub_category_name:
            existing = db.query(SubCategory).filter(SubCategory.sub_category_name == sub_category_in.sub_category_name).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"SubCategory name '{sub_category_in.sub_category_name}' is already registered."
                )

        try:
            update_data = sub_category_in.model_dump(exclude_unset=True)

            if "category_ids" in update_data:
                cat_ids = update_data.pop("category_ids")
                if cat_ids is not None:
                    categories = db.query(Category).filter(Category.category_id.in_(cat_ids)).all()
                    if len(categories) != len(cat_ids):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="One or more provided Parent Category IDs do not exist."
                        )
                    sub_category.categories = categories

            for field, value in update_data.items():
                setattr(sub_category, field, value)

            sub_category.modified_at = datetime.utcnow()
            sub_category.modified_by = current_user_id

            db.commit()
            db.refresh(sub_category)
            return sub_category

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to synchronize subcategory changes: {str(e)}"
            )

    @staticmethod
    def validate_sub_category_deletion(db: Session, sub_category_id: UUID) -> None:
        """
        Enforces deletion rules. Blocks execution if downstream child records are linked.
        """
        from app.models.product_type_model import SubCategoryProductType
        has_associated_product_types = db.query(SubCategoryProductType).filter(
            SubCategoryProductType.sub_category_id == sub_category_id
        ).first()

        if has_associated_product_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Deletion blocked. Active product types are currently mapped to this SubCategory."
            )

    @staticmethod
    def delete_sub_category(db: Session, sub_category_id: UUID) -> None:
        sub_category = SubCategoryService.get_sub_category_by_id(db, sub_category_id)
        
        # Enforce intercept logic step before firing db.delete
        SubCategoryService.validate_sub_category_deletion(db, sub_category_id)
        
        try:
            db.delete(sub_category)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error execution context block failed: {str(e)}"
            )
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.category_model import Category
from app.models.department_model import Department
from app.schemas.category_schema import CategoryCreate, CategoryUpdate
from sqlalchemy.orm import Session, joinedload
class CategoryService:
    @staticmethod
    def get_all_categories(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Category], int]:
        # query = db.query(Category)
        query = db.query(Category).options(joinedload(Category.departments))
        if is_active is not None:
            query = query.filter(Category.is_active == is_active)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Category.category_name.ilike(search_filter),
                    Category.category_description.ilike(search_filter),
                )
            )
        total_count = query.count()
        items = query.order_by(Category.created_at.desc()).offset(offset).limit(limit).all()
        return items, total_count

    @staticmethod
    def get_category_by_id(db: Session, category_id: UUID) -> Category:
        category = db.query(Category).options(joinedload(Category.departments)).filter(Category.category_id == category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID '{category_id}' could not be found."
            )
        return category

    @staticmethod
    def create_category(db: Session, category_in: CategoryCreate, current_user_id: Optional[UUID] = None) -> Category:
        existing = db.query(Category).filter(Category.category_name == category_in.category_name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A category with the name '{category_in.category_name}' already exists."
            )

        try:
            new_category = Category(
                category_name=category_in.category_name,
                category_description=category_in.category_description,
                is_active=category_in.is_active,
                created_by=current_user_id
            )

            if category_in.department_ids:
                departments = db.query(Department).filter(Department.department_id.in_(category_in.department_ids)).all()
                if len(departments) != len(category_in.department_ids):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="One or more specified Department IDs are invalid."
                    )
                new_category.departments = departments

            db.add(new_category)
            db.commit()
            db.refresh(new_category)
            return new_category

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create category: {str(e)}"
            )

    @staticmethod
    def update_category(db: Session, category_id: UUID, category_in: CategoryUpdate, current_user_id: Optional[UUID] = None) -> Category:
        category = CategoryService.get_category_by_id(db, category_id)

        if category_in.category_name and category_in.category_name != category.category_name:
            existing = db.query(Category).filter(Category.category_name == category_in.category_name).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category name '{category_in.category_name}' is already in use."
                )

        try:
            update_data = category_in.model_dump(exclude_unset=True)
            
            # Extract department updates if sent in payload
            if "department_ids" in update_data:
                dept_ids = update_data.pop("department_ids")
                if dept_ids is not None:
                    departments = db.query(Department).filter(Department.department_id.in_(dept_ids)).all()
                    if len(departments) != len(dept_ids):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="One or more provided Department IDs do not exist."
                        )
                    category.departments = departments

            for field, value in update_data.items():
                setattr(category, field, value)

            category.modified_at = datetime.utcnow()
            category.modified_by = current_user_id

            db.commit()
            db.refresh(category)
            return category

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update category: {str(e)}"
            )

    @staticmethod
    def validate_category_deletion(db: Session, category_id: UUID) -> None:
        """
        Blocks structural execution operations if relational child items exist.
        """
        from app.models.sub_category_model import CategorySubCategory

        has_associated_subcategories = db.query(CategorySubCategory).filter(
            CategorySubCategory.category_id == category_id
        ).first()

        if has_associated_subcategories:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Deletion blocked. Active subcategories are currently mapped to this Category."
            )

    @staticmethod
    def delete_category(db: Session, category_id: UUID) -> None:
        category = CategoryService.get_category_by_id(db, category_id)
        
        # Enforce validation check intercept block
        CategoryService.validate_category_deletion(db, category_id)
        
        try:
            db.delete(category)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error during deletion: {str(e)}"
            )
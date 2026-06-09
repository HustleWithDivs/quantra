from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.category_model import Category
from app.schemas.master.category_schema import CategoryRead ,CategoryCreate,CategoryUpdate
from datetime import datetime

class CategoryService:

    @staticmethod
    def get_all_category(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Category]:
        query = db.query(Category)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Category.category_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_category(db: Session, payload: CategoryCreate, current_user_id: UUID = None):
        new_category = Category(
            category_name=payload.category_name,
            category_description=payload.category_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category


    @staticmethod
    def update_category(
        db: Session,
        category_id: UUID,
        payload: CategoryUpdate,
        current_user_id: UUID = None
    ):
        category = db.query(Category).filter(Category.category_id == category_id).first()

        if not category:
            raise Exception("category not found")

        # Update only provided fields
        if payload.category_name is not None:
            category.category_name = payload.category_name

        if payload.category_description is not None:
            category.category_description = payload.category_description

        if payload.is_active is not None:
            category.is_active = payload.is_active

        #  audit fields (based on your model)
        category.modified_by = current_user_id
        category.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def delete_category(db: Session, category_id: UUID):
        category = db.query(Category).filter(Category.category_id == category_id).first()

        if not category:
            raise Exception("Category not found")

        db.delete(category)
        db.commit()
        return True

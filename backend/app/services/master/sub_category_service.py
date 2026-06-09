from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.category_model import SubCategory
from app.schemas.master.sub_category_schema import SubCategoryRead ,SubCategoryCreate,SubCategoryUpdate
from datetime import datetime

class SubCategoryService:

    @staticmethod
    def get_all_sub_category(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[SubCategory]:
        query = db.query(SubCategory)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(SubCategory.sub_category_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_sub_category(db: Session, payload: SubCategoryCreate, current_user_id: UUID = None):
        new_sub_category = SubCategory(
            sub_category_name=payload.sub_category_name,
            sub_category_description=payload.sub_category_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        db.add(new_sub_category)
        db.commit()
        db.refresh(new_sub_category)
        return new_sub_category


    @staticmethod
    def update_sub_category(
        db: Session,
        sub_category_id: UUID,
        payload: SubCategoryUpdate,
        current_user_id: UUID = None
    ):
        sub_category = db.query(SubCategory).filter(SubCategory.sub_category_id == sub_category_id).first()

        if not sub_category:
            raise Exception("SubCategory not found")

        # Update only provided fields
        if payload.sub_category_name is not None:
            sub_category.sub_category_name = payload.sub_category_name

        if payload.sub_category_description is not None:
            sub_category.sub_category_description = payload.sub_category_description

        if payload.is_active is not None:
            sub_category.is_active = payload.is_active

        #  audit fields (based on your model)
        sub_category.modified_by = current_user_id
        sub_category.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(sub_category)

        return sub_category

    @staticmethod
    def delete_sub_category(db: Session, sub_category_id: UUID):
        sub_category = db.query(SubCategory).filter(SubCategory.sub_category_id == sub_category_id).first()

        if not sub_category:
            raise Exception("SubCategory not found")

        db.delete(sub_category)
        db.commit()
        return True

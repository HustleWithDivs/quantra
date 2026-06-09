from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.business_category_model import BusinessCategory
from app.schemas.master.business_category_schema import BusinessCategoryRead ,BusinessCategoryCreate,BusinessCategoryUpdate
from datetime import datetime

class BusinessCategoryService:

    @staticmethod
    def get_all_business_category(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[BusinessCategory]:
        query = db.query(BusinessCategory)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(BusinessCategory.business_category_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_business_category(db: Session, payload: BusinessCategoryCreate, current_user_id: UUID = None):
        new_category = BusinessCategory(
            business_category_name=payload.business_category_name,
            business_category_description=payload.business_category_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category


    @staticmethod
    def update_business_category(
        db: Session,
        business_category_id: UUID,
        payload: BusinessCategoryUpdate,
        current_user_id: UUID = None
    ):
        business_category = db.query(BusinessCategory).filter(BusinessCategory.business_category_id == business_category_id).first()

        if not business_category:
            raise Exception("business_category not found")

        # Update only provided fields
        if payload.business_category_name is not None:
            business_category.business_category_name = payload.business_category_name

        if payload.business_category_description is not None:
            business_category.business_category_description = payload.business_category_description

        if payload.is_active is not None:
            business_category.is_active = payload.is_active

        #  audit fields (based on your model)
        business_category.modified_by = current_user_id
        business_category.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(business_category)

        return business_category

    @staticmethod
    def delete_business_category(db: Session, business_category_id: UUID):
        business_category = db.query(BusinessCategory).filter(BusinessCategory.business_category_id == business_category_id).first()

        if not business_category:
            raise Exception("business_category not found")

        db.delete(business_category)
        db.commit()
        return True

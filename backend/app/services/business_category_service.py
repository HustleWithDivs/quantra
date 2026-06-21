from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.role_model import Role
from app.models.business_category_model import BusinessCategory
from app.schemas.business_category_scehma import BusinessCategoryCreate, BusinessCategoryUpdate
from app.core.security import SecurityHelper
class BusinessCategoryService:
    @staticmethod
    def get_all_business_categories(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[BusinessCategory]:
        """
        Retrieves business categories along with their associated role configurations using an eager JOIN lookup.
        """
        # joinedload pulls the associated roles efficiently in a single query
        query = db.query(BusinessCategory)
        
        if is_active is not None:
            query = query.filter(BusinessCategory.is_active == is_active)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    BusinessCategory.business_category_name.ilike(search_filter),
                    BusinessCategory.business_category_description.ilike(search_filter),
               )
            )
            
        return query.order_by(BusinessCategory.created_at.desc()).offset(offset).limit(limit).all()
    
    @staticmethod
    def create_business_category(db: Session, business_category_in:BusinessCategoryCreate, current_user_id: Optional[UUID] = None) -> BusinessCategory:
        # 1. Verify email uniqueness
        existing_name = db.query(BusinessCategory).filter(BusinessCategory.business_category_name == business_category_in.business_category_name).first()
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A business category account with the name '{business_category_in.business_category_name}' already exists."
            )

      
        try: 
            new_business_category = BusinessCategory(
                business_category_name=business_category_in.business_category_name,
                business_category_description=business_category_in.business_category_description,
                is_active=business_category_in.is_active,
                created_by=current_user_id
            )
            db.add(new_business_category)
            db.flush() # Secure user_id for junction bindings
            db.commit()
            db.refresh(new_business_category)
            return new_business_category

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create business category: {str(e)}"
            )
    @staticmethod
    def update_business_category(db: Session, business_category_id: UUID, business_category_in: BusinessCategoryUpdate, current_user_id: Optional[UUID] = None) -> BusinessCategory:
        # 1. Fetch business category or raise 404
        business_category = db.query(BusinessCategory).filter(BusinessCategory.business_category_id == business_category_id).first()
        if not business_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business Category with ID '{business_category_id}' could not be found."
            )
        
        # 2. Check name unique constraint if it's changing
        if business_category_in.business_category_name and business_category_in.business_category_name != business_category.business_category_name:
            name_check = db.query(BusinessCategory).filter(BusinessCategory.business_category_name == business_category_in.business_category_name).first()
            if name_check:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Name '{business_category_in.business_category_name}' is already in use by another account."
                )
        try:
            # 4. Update basic business category details
            update_data = business_category_in.model_dump(exclude_unset=True, exclude={'role_id'})
            for key, value in update_data.items():
                setattr(business_category, key, value)
            
            business_category.modified_at = datetime.utcnow()
            business_category.modified_by = current_user_id
            
            db.commit()
            db.refresh(business_category)
            return business_category
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update business category record: {str(e)}"
            )
    @staticmethod
    def get_business_category_by_id(db: Session, business_category_id: UUID) -> BusinessCategory:
        """
        Fetches a single business category  along with their single assigned role.
        Raises a 404 error if the business category is missing.
        """
        business_category = db.query(BusinessCategory).filter(BusinessCategory.business_category_id == business_category_id).first()
        
        if not business_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business Category  with ID '{business_category_id}' could not be found."
            )
        return business_category

    @staticmethod
    def delete_business_category(db: Session, business_category_id: UUID) -> None:
        """
        Permanently removes a business category record and purges their role assignment.
        """
        business_category = db.query(BusinessCategory).filter(BusinessCategory.business_category_id == business_category_id).first()
        if not business_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business Category  with ID '{business_category_id}' could not be found."
            )
            
        try:
            # 1. Clear role assignment in junction table first
         
            
            # 2. Erase the core business category  record
            db.delete(business_category)
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete business category  due to a database error: {str(e)}"
            )
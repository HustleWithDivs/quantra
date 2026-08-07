from uuid import UUID
from typing import List, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.brand_model import Brand
from app.schemas.brand_schema import BrandRead ,BrandCreate,BrandUpdate
from datetime import datetime

class BrandService:

    @staticmethod
    def get_all_brand(
        db: Session, 
        limit: int = 100,
         offset: int = 0,
         is_active: Optional[bool] = None,
          search: Optional[str] = None
        ) -> Tuple[List[Brand], int]:
        query = db.query(Brand)

        if is_active is not None:
            query = query.filter(Brand.is_active == is_active)
       

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Brand.brand_name.ilike(search_filter),
                    Brand.description.ilike(search_filter),
               )
            )
        total_count = query.count()
        items= query.order_by(Brand.created_at.desc()).offset(offset).limit(limit).all()
        return items, total_count

    @staticmethod
    def get_brand_by_id(db: Session, brand_id: UUID) -> Brand:
        brand = db.query(Brand).filter(Brand.brand_id == brand_id).first()
        
        if not brand:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Brand with ID '{brand_id}' could not be found."
            )
        return brand
    

    @staticmethod
    def create_brand(db: Session, payload: BrandCreate, current_user_id: UUID = None):
        # 1. Verify  uniqueness
        existing_name = db.query(Brand).filter(Brand.brand_name == payload.brand_name).first()
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A brand account with the name '{payload.brand_name}' already exists."
            )

      
        try: 
            brand = Brand(
                brand_name=payload.brand_name,
                description=payload.description,
                is_active=payload.is_active if hasattr(payload, "is_active") else True,
                created_by=current_user_id.user_id
            )

            db.add(brand)
            db.commit()
            db.refresh(brand)
            return brand

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create brand: {str(e)}"
            )    


    @staticmethod
    def update_brand(
        db: Session,
        brand_id: UUID,
        brand_in: BrandUpdate,
        current_user_id: UUID = None
    ):
         # 1. Fetch brand or raise 404
        brand = db.query(Brand).filter(Brand.brand_id == brand_id).first()
        if not brand:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Brand with ID '{brand_id}' could not be found."
            )
        
        # 2. Check name unique constraint if it's changing
        if brand_in.brand_name and brand_in.brand_name != brand.brand_name:
            name_check = db.query(Brand).filter(Brand.brand_name == brand_in.brand_name).first()
            if name_check:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Name '{brand_in.brand_name}' is already in use by another account."
                )
        try:
            # 4. Update basic business category details
            update_data = brand_in.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(brand, key, value)
            
            brand.modified_at = datetime.utcnow()
            brand.modified_by = current_user_id
            
            db.commit()
            db.refresh(brand)
            return brand
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update brand record: {str(e)}"
            )
        


    @staticmethod
    def delete_brand(db: Session, brand_id: UUID) -> None:
        """
        Permanently removes a brand record after ensuring no active child departments exist.
        """
        brand = db.query(Brand).filter(
            Brand.brand_id == brand_id
        ).first()
        
        if not brand:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Brand with ID '{brand_id}' could not be found."
            )
            
            
        try:
            # Erase the core business category record safely
            db.delete(brand)
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete brand due to a database error: {str(e)}"
            )

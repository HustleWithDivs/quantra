from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.brand_model import Brand
from app.schemas.brand_schema import BrandRead ,BrandCreate,BrandUpdate
from datetime import datetime

class BrandService:

    @staticmethod
    def get_all_brand(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Brand]:
        query = db.query(Brand)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Brand.brand_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_brand(db: Session, payload: BrandCreate, current_user_id: UUID = None):
        brand = Brand(
            brand_name=payload.brand_name,
            description=payload.description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        db.add(brand)
        db.commit()
        db.refresh(brand)
        return brand


    @staticmethod
    def update_brand(
        db: Session,
        brand_id: UUID,
        payload: BrandUpdate,
        current_user_id: UUID = None
    ):
        brand = db.query(Brand).filter(Brand.brand_id == brand_id).first()

        if not brand:
            raise Exception("Brand not found")

        # Update only provided fields
        if payload.brand_name is not None:
            brand.brand_name = payload.brand_name

        if payload.description is not None:
            brand.description = payload.description

        if payload.is_active is not None:
            brand.is_active = payload.is_active

        #  audit fields (based on your model)
        brand.modified_by = current_user_id
        brand.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(brand)

        return brand

    @staticmethod
    def delete_brand(db: Session, brand_id: UUID):
        brand = db.query(Brand).filter(Brand.brand_id == brand_id).first()

        if not brand:
            raise Exception("Brand not found")

        db.delete(brand)
        db.commit()
        return True

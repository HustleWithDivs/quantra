from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.brand_model import Brand

class BrandService:

    @staticmethod
    def get_all_brands(db: Session):
        return BrandRepository.get_all(db)

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
        # return query.order_by(Brand.created_at.desc()).offset(offset).limit(limit).all()
    
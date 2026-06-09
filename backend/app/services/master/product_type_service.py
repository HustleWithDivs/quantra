from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.product_type_model import ProductType
from app.models.master.category_model import SubCategory
from app.schemas.master.product_type_schema import ProductTypeRead ,ProductTypeCreate,ProductTypeUpdate
from datetime import datetime

class ProductTypeService:

    @staticmethod
    def get_all_product_type(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[ProductType]:
        query = db.query(ProductType)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(ProductType.product_type.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_product_type(db: Session, payload: ProductTypeCreate, current_user_id: UUID = None):
        product_type_obj = ProductType(
            sub_category_id=payload.sub_category_id, 
            product_type=payload.product_type,
            product_type_description=payload.product_type_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        # validate FK exists (recommended)
        sub_category = db.query(SubCategory).filter(
            SubCategory.sub_category_id == payload.sub_category_id
        ).first()
        if not sub_category:
            raise HTTPException(status_code=404, detail="Invalid sub category")    


        db.add(product_type_obj)
        db.commit()
        db.refresh(product_type_obj)
        return product_type_obj


    @staticmethod
    def update_product_type(
        db: Session,
        product_type_id: UUID,
        payload: ProductTypeUpdate,
        current_user_id: UUID = None
    ):
        dept_obj = db.query(ProductType).filter(ProductType.product_type_id == product_type_id).first()

        if not dept_obj:
            raise Exception("product_type not found")

        # Update only provided fields
        if payload.product_type is not None:
            dept_obj.product_type = payload.product_type

        if payload.product_type_description is not None:
            dept_obj.product_type_description = payload.product_type_description

        if payload.is_active is not None:
            dept_obj.is_active = payload.is_active

        if payload.sub_category_id is not None:
            dept_obj.sub_category_id = payload.sub_category_id

        # validate FK exists (recommended)
        sub_category = db.query(SubCategory).filter(
            SubCategory.sub_category_id == payload.sub_category_id
        ).first()
        if not sub_category:
            raise HTTPException(status_code=404, detail="Invalid sub category")    

        
        dept_obj.modified_by = current_user_id
        dept_obj.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(dept_obj)

        return dept_obj

    @staticmethod
    def delete_product_type(db: Session, product_type_id: UUID):
        product_type = db.query(ProductType).filter(ProductType.product_type_id == product_type_id).first()

        if not product_type:
            raise Exception("product_type not found")

        db.delete(product_type)
        db.commit()
        return True

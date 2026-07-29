from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.supplier_model import Supplier
from app.schemas.supplier_schema import SupplierRead,SupplierCreate, SupplierUpdate
from datetime import datetime


class SupplierService:

    @staticmethod
    def get_all_supplier(
        db: Session, 
        limit: int = 100,
         offset: int = 0,
         is_active: Optional[bool] = None,
          search: Optional[str] = None
        ) -> List[Supplier]:
        query = db.query(Supplier)

        if is_active is not None:
            query = query.filter(Supplier.is_active == is_active)
       

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Supplier.supplier_code.ilike(search_filter),
                    Supplier.supplier_name.ilike(search_filter),
                    
               )
            )
            
        return query.order_by(Supplier.created_at.desc()).offset(offset).limit(limit).all()


    @staticmethod
    def create_supplier(db: Session, payload: SupplierCreate, current_user_id:UUID=None):
         # 1. Verify  uniqueness
        existing_name = db.query(Supplier).filter(Supplier.supplier_name == payload.supplier_name).first()
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A supplier account with the name '{payload.supplier_name}' already exists."
            )

        try:
            supplier = Supplier(
                        supplier_code=payload.supplier_code,
                        supplier_name=payload.supplier_name,
                        contact_person=payload.contact_person,
                        email=payload.email,
                        phone=payload.phone,
                        address=payload.address,
                        city=payload.city,
                        state=payload.state,
                        country_id=payload.country_id,
                        gst_number=payload.gst_number,
                        is_active=payload.is_active if hasattr(payload, "is_active") else True,
                        created_by=current_user_id.user_id
            )
            db.add(supplier)
            db.commit()
            db.refresh(supplier)
            return supplier

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create supplier: {str(e)}"
            )    


       

    @staticmethod
    def update_supplier(
        db: Session,
        supplier_id: UUID,
        supplier_in: SupplierUpdate,
        current_user_id: UUID = None
    ):
         # 1. Fetch supplier or raise 404
        supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Supplier with ID '{supplier_id}' could not be found."
            )
        
        # 2. Check name unique constraint if it's changing
        if supplier_in.supplier_name and supplier_in.supplier_name != supplier.supplier_name:
            name_check = db.query(Supplier).filter(Supplier.supplier_name == supplier_in.supplier_name).first()
            if name_check:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Name '{supplier_in.supplier_name}' is already in use by another account."
                )
        try:
            # 4. Update basic business category details
            update_data = supplier_in.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(supplier, key, value)
            
            supplier.modified_at = datetime.utcnow()
            supplier.modified_by = current_user_id
            
            db.commit()
            db.refresh(supplier)
            return supplier
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update supplier record: {str(e)}"
            )



    @staticmethod
    def delete_supplier(db: Session, supplier_id: UUID) -> None:
        """
        Permanently removes a supplier record after ensuring no active child departments exist.
        """
        supplier = db.query(Supplier).filter(
            Supplier.supplier_id == supplier_id
        ).first()
        
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Supplier with ID '{supplier_id}' could not be found."
            )
            
            
        try:
            # Erase the core business category record safely
            db.delete(supplier)
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete supplier due to a database error: {str(e)}"
            ) 

    @staticmethod
    def get_supplier_by_id(db: Session, supplier_id: UUID) -> Supplier:
        supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
        
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Supplier with ID '{supplier_id}' could not be found."
            )
        return supplier           
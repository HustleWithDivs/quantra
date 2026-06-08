from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.models.supplier_model import Supplier
from app.schemas.supplier_schema import SupplierCreate, SupplierUpdate


class SupplierService:

    @staticmethod
    def get_all_supplier(db: Session, limit: int, offset: int, search: str = None):
        query = db.query(Supplier)

        if search:
            query = query.filter(
                Supplier.supplier_name.ilike(f"%{search}%")
                | Supplier.supplier_code.ilike(f"%{search}%")
            )

        return query.offset(offset).limit(limit).all()


    @staticmethod
    def create_supplier(db: Session, payload: SupplierCreate, current_user_id=None):
        supplier = Supplier(
            supplier_id=uuid.uuid4(),
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
            is_active=payload.is_active,
            created_at=datetime.utcnow(),
            created_by=current_user_id,
        )

        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier


    @staticmethod
    def update_supplier(db: Session, supplier_id, payload: SupplierUpdate, current_user_id=None):
        supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()

        if not supplier:
            return None

        data = payload.model_dump(exclude_unset=True)

        for key, value in data.items():
            setattr(supplier, key, value)

        supplier.modified_at = datetime.utcnow()
        supplier.modified_by = current_user_id

        db.commit()
        db.refresh(supplier)
        return supplier


    @staticmethod
    def delete_supplier(db: Session, supplier_id):
        supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()

        if not supplier:
            return False

        db.delete(supplier)
        db.commit()
        return True
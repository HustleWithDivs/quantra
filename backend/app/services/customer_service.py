from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.customer_model import Customer

class CustomerService:
    @staticmethod
    def get_all_customers(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Customer]:
        query = db.query(Customer)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Customer.first_name.ilike(sf), Customer.last_name.ilike(sf), Customer.email.ilike(sf))
            )
        return query.order_by(Customer.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_customer_profile_details(db: Session, customer_id: UUID) -> Customer:
        # Pulls Customer -> Orders -> Sub-items down efficiently in a single step
        customer = db.query(Customer).options(
            joinedload(Customer.orders).joinedload(Customer.orders.items)
        ).filter(Customer.customer_id == customer_id).first()

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer record with ID '{customer_id}' does not exist."
            )
        return customer
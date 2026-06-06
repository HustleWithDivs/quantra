from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.customer_schema import CustomerRead, CustomerDetailsRead
from app.services.customer_service import CustomerService
from app.core.database import get_db
from app.core.dependency import  PermissionChecker

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=APIResponse[List[CustomerRead]])
def list_customers(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    customers = CustomerService.get_all_customers(db, limit, offset, search)
    data = [CustomerRead.model_validate(c) for c in customers]
    return APIResponse.success(message="Customer records fetched successfully", data=data)


@router.get("/{customer_id}", response_model=APIResponse[CustomerDetailsRead])
def get_customer_comprehensive_profile(
customer_id: UUID, 
db: Session = Depends(get_db), 
current_user: User = Depends(PermissionChecker("customer:view_order"))):
    """Fetch complete customer registration data alongside entire historical order ledger summaries."""
    customer_db = CustomerService.get_customer_profile_details(db, customer_id)
    data = CustomerDetailsRead.model_validate(customer_db)
    return APIResponse.success(message="Customer profile ledger retrieved successfully", data=data)
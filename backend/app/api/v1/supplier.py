from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.supplier_service import SupplierService
from app.schemas.response_schema import APIResponse
from app.schemas.supplier_schema import SupplierRead, SupplierCreate, SupplierUpdate


router = APIRouter(prefix="/supplier", tags=["Suppliers"])


# =========================
# LIST SUPPLIERS
# =========================
@router.get("", response_model=APIResponse[List[SupplierRead]])
def list_supplier(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    Get list of all suppliers.
    """

    suppliers = SupplierService.get_all_supplier(db, limit, offset, search)

    data = [SupplierRead.model_validate(s) for s in suppliers]

    return APIResponse.success(
        message="Supplier records fetched successfully",
        data=data
    )


# =========================
# CREATE SUPPLIER
# =========================
@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[SupplierRead])
def create_supplier(
    payload: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    supplier = SupplierService.create_supplier(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SupplierRead.model_validate(supplier)

    return APIResponse.success(
        code=201,
        message="Supplier created successfully",
        data=response_data
    )


# =========================
# UPDATE SUPPLIER
# =========================
@router.put(
    "/{supplier_id}",
    response_model=APIResponse[SupplierRead],
    status_code=status.HTTP_200_OK
)
def update_supplier(
    supplier_id: UUID,
    payload: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing supplier.
    """

    updated_supplier = SupplierService.update_supplier(
        db=db,
        supplier_id=supplier_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SupplierRead.model_validate(updated_supplier)

    return APIResponse.success(
        code=200,
        message="Supplier synchronized successfully",
        data=response_data
    )


# =========================
# DELETE SUPPLIER
# =========================
@router.delete("/{supplier_id}", response_model=APIResponse[dict])
def delete_supplier(
    supplier_id: UUID,
    db: Session = Depends(get_db),
):
    SupplierService.delete_supplier(db=db, supplier_id=supplier_id)

    return APIResponse.success(
        code=200,
        message="Supplier deleted successfully",
        data={}
    )
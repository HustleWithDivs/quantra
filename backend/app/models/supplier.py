from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.supplier_service import SupplierService
from app.schemas.response_schema import APIResponse
from app.schemas.supplier_schema import SupplierRead, SupplierCreate, SupplierUpdate,SupplierResponseData
from app.core.dependency import PermissionChecker, get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/supplier", tags=["Suppliers"])
# =========================
# LIST SUPPLIERS
# =========================
@router.get("", response_model=APIResponse[List[SupplierRead]],
status_code=status.HTTP_200_OK
)
def list_supplier(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("supplier:view_supplier"))
):
    """
    Get list of all suppliers.
    """
    try:
        suppliers_db = SupplierService.get_all_suppliers(
            db=db, 
            limit=limit, 
            offset=offset,
            is_active=is_active, 
            search=search
        )
        suppliers_data = [SupplierRead.model_validate(suppliers) for suppliers in suppliers_db]
        return APIResponse.success(data=suppliers_data)

        data = [SupplierRead.model_validate(s) for s in suppliers]
        return APIResponse.success(message="Supplier records fetched successfully", data=data)
    except Exception as e:
        return APIResponse.fail(message=str(e))


@router.get(
    "/{supplier_id}", 
    response_model=APIResponse[SupplierResponseData],
    status_code=status.HTTP_200_OK
)
def get_supplier_details(
    supplier_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("supplier:view_supplier"))
):
    """
    Retrieve comprehensive business category details for a specific supplier id.
    """
    supplier_db = SupplierService.get_supplier_by_id(db=db, supplier_id=supplier_id)
    return APIResponse.success(
        code=200,
        message="Supplier retrieved successfully",
        data=SupplierResponseData.model_validate(supplier_db)
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[SupplierRead])
def create_supplier(
    payload: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("supplier:create_supplier"))
):
    
    current_user_id = current_user.user_id # Integrated with Auth later
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

@router.put(
    "/{supplier_id}",
    response_model=APIResponse[SupplierRead],
    status_code=status.HTTP_200_OK
)
def update_supplier(
    supplier_id: UUID,
    supplier_in: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing supplier.
    """

    updated_supplier = SupplierService.update_supplier(
        db=db,
        supplier_id=supplier_id,
        supplier_in=supplier_in,
        current_user_id=current_user
    )

    response_data = SupplierRead.model_validate(updated_supplier)

    return APIResponse.success(
        code=200,
        message="Supplier synchronized successfully",
        data=response_data
    )  

      

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
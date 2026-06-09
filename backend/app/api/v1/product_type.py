from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master.product_type_service import ProductTypeService
from app.schemas.response_schema import APIResponse
from app.schemas.master.product_type_schema import ProductTypeRead, ProductTypeCreate,ProductTypeUpdate



router = APIRouter(prefix="/product_type", tags=["ProductType"])
@router.get("", response_model=APIResponse[List[ProductTypeRead]])
def list_product_type(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    product_type = ProductTypeService.get_all_product_type(db, limit, offset, search)
    data = [ProductTypeRead.model_validate(b) for b in product_type]
    return APIResponse.success(message="product_type records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[ProductTypeRead])
def create_product_type(
    payload: ProductTypeCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    product_type = ProductTypeService.create_product_type(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = ProductTypeRead.model_validate(product_type)

    return APIResponse.success(
        code=201,
        message="product_type created successfully",
        data=response_data
    )

@router.put(
    "/{product_type_id}",
    response_model=APIResponse[ProductTypeRead],
    status_code=status.HTTP_200_OK
)
def update_product_type(
    product_type_id: UUID,
    payload: ProductTypeUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing product_type.
    """

    updated_product_type = ProductTypeService.update_product_type(
        db=db,
        product_type_id=product_type_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = ProductTypeRead.model_validate(updated_product_type)

    return APIResponse.success(
        code=200,
        message="product_type synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{product_type_id}", response_model=APIResponse[dict])
def delete_product_type(
    product_type_id: UUID,
    db: Session = Depends(get_db),
):
    ProductTypeService.delete_product_type(db=db, product_type_id=product_type_id)

    return APIResponse.success(
        code=200,
        message="product_type deleted successfully",
        data={}
    )
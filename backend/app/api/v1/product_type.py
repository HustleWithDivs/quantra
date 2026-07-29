import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.product_type_schema import ProductTypeCreate,ProductTypeRead, ProductTypeResponseData, ProductTypeUpdate
from app.services.product_type_service import ProductTypeService
from app.core.database import get_db
from app.core.dependency import PermissionChecker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/product-type", tags=["Product Type"])


@router.get(
    "",
    response_model=APIResponse[List[ProductTypeResponseData]],
    status_code=status.HTTP_200_OK
)
def list_product_type(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product_type:view_product_type"))
):
    try:
        product_type_db = ProductTypeService.get_all_product_types(
            db=db, limit=limit, offset=offset, is_active=is_active, search=search
        )
        product_type_data = [ProductTypeResponseData.model_validate(sc) for sc in product_type_db]
        return APIResponse.success(code=200, message="Product Type retrieved successfully", data=product_type_data)
    except Exception as e:
        logger.error(f"Error handling product type query loop: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal processing fault.")


@router.get(
    "/{product_type_id}",
    response_model=APIResponse[ProductTypeResponseData],
    status_code=status.HTTP_200_OK
)
def get_product_type_details(
    product_type_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product_type:view_product_type"))
):
    product_type_db = ProductTypeService.get_product_type_by_id(db=db, product_type_id=product_type_id)
    return APIResponse.success(code=200, message="ProductType instance retrieved", data=product_type_db)


@router.post(
    "",
    response_model=APIResponse[ProductTypeResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_product_type(
    payload: ProductTypeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product_type:create_product_type"))
):
    new_product_type = ProductTypeService.create_product_type(
        db=db, product_type_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=201, message="Product Type provisioned successfully", data=new_product_type)


@router.put(
    "/{product_type_id}",
    response_model=APIResponse[ProductTypeResponseData],
    status_code=status.HTTP_200_OK
)
def update_product_type(
    product_type_id: UUID,
    payload: ProductTypeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product_type:update_product_type"))
):
    updated_product_type = ProductTypeService.update_product_type(
        db=db, product_type_id=product_type_id, product_type_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=200, message="Product type targets updated seamlessly", data=updated_product_type)


@router.delete(
    "/{product_type_id}",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_product_type(
    product_type_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product_type:delete_product_type"))
):
    ProductTypeService.delete_product_type(db=db, product_type_id=product_type_id)
    return APIResponse.success(code=200, message="Product Type elements terminated", data={})
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.brand_service import BrandService
from app.schemas.response_schema import APIResponse
from app.schemas.brand_schema import BrandRead, BrandCreate,BrandUpdate



router = APIRouter(prefix="/brand", tags=["Brands"])
@router.get("", response_model=APIResponse[List[BrandRead]])
def list_brand(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    brand = BrandService.get_all_brand(db, limit, offset, search)
    data = [BrandRead.model_validate(b) for b in brand]
    return APIResponse.success(message="Brand records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[BrandRead])
def create_brand(
    payload: BrandCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    brand = BrandService.create_brand(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = BrandRead.model_validate(brand)

    return APIResponse.success(
        code=201,
        message="Brand created successfully",
        data=response_data
    )

@router.put(
    "/{brand_id}",
    response_model=APIResponse[BrandRead],
    status_code=status.HTTP_200_OK
)
def update_brand(
    brand_id: UUID,
    payload: BrandUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing brand.
    """

    updated_brand = BrandService.update_brand(
        db=db,
        brand_id=brand_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = BrandRead.model_validate(updated_brand)

    return APIResponse.success(
        code=200,
        message="Brand synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{brand_id}", response_model=APIResponse[dict])
def delete_brand(
    brand_id: UUID,
    db: Session = Depends(get_db),
):
    BrandService.delete_brand(db=db, brand_id=brand_id)

    return APIResponse.success(
        code=200,
        message="Brand deleted successfully",
        data={}
    )
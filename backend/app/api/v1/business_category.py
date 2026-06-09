from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master.business_category_service import BusinessCategoryService
from app.schemas.response_schema import APIResponse
from app.schemas.master.business_category_schema import BusinessCategoryRead, BusinessCategoryCreate,BusinessCategoryUpdate



router = APIRouter(prefix="/business_category", tags=["BusinessCategory"])
@router.get("", response_model=APIResponse[List[BusinessCategoryRead]])
def list_business_category(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    business_category = BusinessCategoryService.get_all_business_category(db, limit, offset, search)
    data = [BusinessCategoryRead.model_validate(b) for b in business_category]
    return APIResponse.success(message="BusinessCategory records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[BusinessCategoryRead])
def create_business_category(
    payload: BusinessCategoryCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    business_category = BusinessCategoryService.create_business_category(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = BusinessCategoryRead.model_validate(business_category)

    return APIResponse.success(
        code=201,
        message="business_category created successfully",
        data=response_data
    )

@router.put(
    "/{business_category_id}",
    response_model=APIResponse[BusinessCategoryRead],
    status_code=status.HTTP_200_OK
)
def update_business_category(
    business_category_id: UUID,
    payload: BusinessCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing business_category.
    """

    updated_business_category = BusinessCategoryService.update_business_category(
        db=db,
        business_category_id=business_category_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = BusinessCategoryRead.model_validate(updated_business_category)

    return APIResponse.success(
        code=200,
        message="business_category synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{business_category_id}", response_model=APIResponse[dict])
def delete_business_category(
    business_category_id: UUID,
    db: Session = Depends(get_db),
):
    BusinessCategoryService.delete_business_category(db=db, business_category_id=business_category_id)

    return APIResponse.success(
        code=200,
        message="business_category deleted successfully",
        data={}
    )
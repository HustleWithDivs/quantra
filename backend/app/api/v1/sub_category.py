from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master.sub_category_service import SubCategoryService
from app.schemas.response_schema import APIResponse
from app.schemas.master.sub_category_schema import SubCategoryRead, SubCategoryCreate,SubCategoryUpdate



router = APIRouter(prefix="/sub_category", tags=["SubCategory"])
@router.get("", response_model=APIResponse[List[SubCategoryRead]])
def list_sub_category(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    sub_category = SubCategoryService.get_all_sub_category(db, limit, offset, search)
    data = [SubCategoryRead.model_validate(b) for b in sub_category]
    return APIResponse.success(message="sub_category records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[SubCategoryRead])
def create_sub_category(
    payload: SubCategoryCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    sub_category = SubCategoryService.create_sub_category(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SubCategoryRead.model_validate(sub_category)

    return APIResponse.success(
        code=201,
        message="sub_category created successfully",
        data=response_data
    )

@router.put(
    "/{sub_category_id}",
    response_model=APIResponse[SubCategoryRead],
    status_code=status.HTTP_200_OK
)
def update_sub_category(
    sub_category_id: UUID,
    payload: SubCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing sub_category.
    """

    updated_sub_category = SubCategoryService.update_sub_category(
        db=db,
        sub_category_id=sub_category_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SubCategoryRead.model_validate(updated_sub_category)

    return APIResponse.success(
        code=200,
        message="sub_category synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{sub_category_id}", response_model=APIResponse[dict])
def delete_sub_category(
    sub_category_id: UUID,
    db: Session = Depends(get_db),
):
    SubCategoryService.delete_sub_category(db=db, sub_category_id=sub_category_id)

    return APIResponse.success(
        code=200,
        message="sub_category deleted successfully",
        data={}
    )
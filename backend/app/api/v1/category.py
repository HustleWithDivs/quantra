from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master.category_service import CategoryService
from app.schemas.response_schema import APIResponse
from app.schemas.master.category_schema import CategoryRead, CategoryCreate,CategoryUpdate



router = APIRouter(prefix="/category", tags=["Category"])
@router.get("", response_model=APIResponse[List[CategoryRead]])
def list_category(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    category = CategoryService.get_all_category(db, limit, offset, search)
    data = [CategoryRead.model_validate(b) for b in category]
    return APIResponse.success(message="Category records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[CategoryRead])
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    category = CategoryService.create_category(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = CategoryRead.model_validate(category)

    return APIResponse.success(
        code=201,
        message="Category created successfully",
        data=response_data
    )

@router.put(
    "/{category_id}",
    response_model=APIResponse[CategoryRead],
    status_code=status.HTTP_200_OK
)
def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing category.
    """

    updated_category = CategoryService.update_category(
        db=db,
        category_id=category_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = CategoryRead.model_validate(updated_category)

    return APIResponse.success(
        code=200,
        message="Category synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{category_id}", response_model=APIResponse[dict])
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db),
):
    CategoryService.delete_category(db=db, category_id=category_id)

    return APIResponse.success(
        code=200,
        message="Category deleted successfully",
        data={}
    )
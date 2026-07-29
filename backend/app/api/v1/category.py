import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.category_schema import CategoryRead, CategoryCreate, CategoryResponseData, CategoryUpdate
from app.services.category_service import CategoryService
from app.core.database import get_db
from app.core.dependency import PermissionChecker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/category", tags=["Category"])

@router.get(
    "", 
    response_model=APIResponse[List[CategoryRead]],
    status_code=status.HTTP_200_OK
)
def list_categories(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("category:view_category"))
):
    try:
        categories_db = CategoryService.get_all_categories(
            db=db, limit=limit, offset=offset, is_active=is_active, search=search
        )
        categories_data = [CategoryRead.model_validate(c) for c in categories_db]
        return APIResponse.success(code=200, message="Categories retrieved successfully", data=categories_data)
    except Exception as e:
        logger.error(f"Error listing categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal processing fault.")

@router.get(
    "/{category_id}", 
    response_model=APIResponse[CategoryRead],
    status_code=status.HTTP_200_OK
)
def get_category_details(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("category:view_category"))
):
    category_db = CategoryService.get_category_by_id(db=db, category_id=category_id)
    return APIResponse.success(code=200, message="Category retrieved successfully", data=category_db)

@router.post(
    "", 
    response_model=APIResponse[CategoryResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("category:create_category"))
):
    new_category = CategoryService.create_category(
        db=db, category_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=201, message="Category provisioned successfully", data=new_category)

@router.put(
    "/{category_id}", 
    response_model=APIResponse[CategoryResponseData],
    status_code=status.HTTP_200_OK
)
def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("category:update_category"))
):
    updated_category = CategoryService.update_category(
        db=db, category_id=category_id, category_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=200, message="Category updated successfully", data=updated_category)

@router.delete(
    "/{category_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("category:delete_category"))
):
    CategoryService.delete_category(db=db, category_id=category_id)
    return APIResponse.success(code=200, message="Category removed successfully", data={})
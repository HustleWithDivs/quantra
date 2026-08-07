import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse,PaginatedResponse
from app.schemas.sub_category_schema import SubCategoryRead, SubCategoryCreate, SubCategoryResponseData, SubCategoryUpdate
from app.services.sub_category_service import SubCategoryService
from app.core.database import get_db
from app.core.dependency import PermissionChecker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sub-category", tags=["SubCategory"])


@router.get(
    "",
    response_model=APIResponse[PaginatedResponse[SubCategoryRead]],
    status_code=status.HTTP_200_OK
)
def list_sub_categories(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("sub_category:view_sub_category"))
):
    try:
        sub_categories_db, total_count = SubCategoryService.get_all_sub_categories(
            db=db, limit=limit, offset=offset, is_active=is_active, search=search
        )
        sub_categories_data = [SubCategoryRead.model_validate(sc) for sc in sub_categories_db]
        paginated_data = {
            "items": sub_categories_data,
            "total": total_count,
            "limit": limit,
            "offset": offset
        }
        return APIResponse.success(code=200, message="SubCategories matrix pulled successfully", data=paginated_data)
    except Exception as e:
        logger.error(f"Error handling subcategories query loop: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal processing fault.")


@router.get(
    "/{sub_category_id}",
    response_model=APIResponse[SubCategoryResponseData],
    status_code=status.HTTP_200_OK
)
def get_sub_category_details(
    sub_category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("sub_category:view_sub_category"))
):
    sub_category_db = SubCategoryService.get_sub_category_by_id(db=db, sub_category_id=sub_category_id)
    return APIResponse.success(code=200, message="SubCategory instance retrieved", data=sub_category_db)


@router.post(
    "",
    response_model=APIResponse[SubCategoryResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_sub_category(
    payload: SubCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("sub_category:create_sub_category"))
):
    new_sub_category = SubCategoryService.create_sub_category(
        db=db, sub_category_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=201, message="SubCategory provisioned successfully", data=new_sub_category)


@router.put(
    "/{sub_category_id}",
    response_model=APIResponse[SubCategoryResponseData],
    status_code=status.HTTP_200_OK
)
def update_sub_category(
    sub_category_id: UUID,
    payload: SubCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("sub_category:update_sub_category"))
):
    updated_sub_category = SubCategoryService.update_sub_category(
        db=db, sub_category_id=sub_category_id, sub_category_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=200, message="SubCategory targets updated seamlessly", data=updated_sub_category)


@router.delete(
    "/{sub_category_id}",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_sub_category(
    sub_category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("sub_category:delete_sub_category"))
):
    SubCategoryService.delete_sub_category(db=db, sub_category_id=sub_category_id)
    return APIResponse.success(code=200, message="SubCategory elements terminated", data={})
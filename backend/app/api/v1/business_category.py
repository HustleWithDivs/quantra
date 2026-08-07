import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse, PaginatedResponse
from app.schemas.business_category_scehma import BusinessCategoryRead, BusinessCategoryCreate, BusinessCategoryResponseData, BusinessCategoryUpdate
from app.services.business_category_service import BusinessCategoryService
from app.core.database import get_db
from app.core.dependency import PermissionChecker, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/business-category", tags=["Business Category"])


# =========================================================================
# 1. STATIC/EXPLICIT ROUTING PATHS (Must be declared first!)
# =========================================================================

@router.get(
    "", 
    response_model=APIResponse[PaginatedResponse[BusinessCategoryRead]],
    status_code=status.HTTP_200_OK
)
def list_business_categories(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("business_category:view_business_category"))
):
    try:
        business_category_db, total_count = BusinessCategoryService.get_all_business_categories(
            db=db, 
            limit=limit, 
            offset=offset,
            is_active=is_active, 
            search=search
        )
        business_category_data = [BusinessCategoryRead.model_validate(business_category) for business_category in business_category_db]
        paginated_data = {
            "items": business_category_data,
            "total": total_count,
            "limit": limit,
            "offset": offset
        }
        return APIResponse.success(data=paginated_data)
    except Exception as e:
        return APIResponse.fail(message=str(e))


@router.post(
    "",
    response_model=APIResponse[BusinessCategoryResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_business_category(
    payload: BusinessCategoryCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("business_category:create_business_category"))
):
    
    current_user_id = current_user.user_id # Integrated with Auth later

    new_business_category_db = BusinessCategoryService.create_business_category(db=db, business_category_in=payload, current_user_id=current_user_id)
    return APIResponse.success(
        code=201,
        message="Business Category created successfully",
        data=BusinessCategoryResponseData.model_validate(new_business_category_db)
    )

# =========================================================================
# 2. DYNAMIC PATH VARIABLE ROUTING (Must be declared last!)
# =========================================================================

@router.get(
    "/{business_category_id}", 
    response_model=APIResponse[BusinessCategoryResponseData],
    status_code=status.HTTP_200_OK
)
def get_business_category_details(
    business_category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("business_category:view_business_category"))
):
    """
    Retrieve comprehensive business category details for a specific business category id.
    """
    business_category_db = BusinessCategoryService.get_business_category_by_id(db=db, business_category_id=business_category_id)
    return APIResponse.success(
        code=200,
        message="Business Categories retrieved successfully",
        data=BusinessCategoryResponseData.model_validate(business_category_db)
    )


@router.put(
    "/{business_category_id}", 
    response_model=APIResponse[BusinessCategoryResponseData],
    status_code=status.HTTP_200_OK
)
def update_business_category(
    business_category_id: UUID,
    payload: BusinessCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("business_category:view_business_category","business_category:update_business_category"))
):
    """
    Modify business category and its attributes.
    """
    current_user_id = current_user.user_id # Integrated with Auth later

    updated_business_category_db = BusinessCategoryService.update_business_category(
        db=db, 
        business_category_id=business_category_id, 
        business_category_in=payload, 
        current_user_id=current_user_id
    )
    
    return APIResponse.success(
        code=200,
        message="Business Category synchronized successfully",
        data=BusinessCategoryResponseData.model_validate(updated_business_category_db)
    )


@router.delete(
    "/{business_category_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_business_category(
    business_category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("business_category:view_business_category","business_category:delete_business_category"))
):
    """
    Permanently purge a business category record completely.
    """

    BusinessCategoryService.delete_business_category(db=db, business_category_id=business_category_id)
    return APIResponse.success(
        code=200,
        message="Business Category removed successfully",
        data={}
    )
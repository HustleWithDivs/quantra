import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.user_schema import UserRead, UserCreate, UserResponseData, UserUpdate
from app.services.user_service import UserService
from app.core.database import get_db
from app.core.dependency import PermissionChecker, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["Users"])


# =========================================================================
# 1. STATIC/EXPLICIT ROUTING PATHS (Must be declared first!)
# =========================================================================

@router.get(
    "", 
    response_model=APIResponse[List[UserRead]],
    status_code=status.HTTP_200_OK
)
def list_users(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:view_user"))
):
    try:
        users_db = UserService.get_all_users(
            db=db, 
            limit=limit, 
            offset=offset, \
            is_active=is_active, 
            search=search
        )
        users_data = [UserRead.model_validate(user) for user in users_db]
        return APIResponse.success(data=users_data)
    except Exception as e:
        return APIResponse.fail(message=str(e))


@router.post(
    "",
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_user(
    payload: UserCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:create_users"))
):
    current_user_id = current_user.user_id # Integrated with Auth later

    new_user_db = UserService.create_user(db=db, user_in=payload, current_user_id=current_user_id)
    return APIResponse.success(
        code=201,
        message="User account and security associations built successfully",
        data=UserResponseData.model_validate(new_user_db)
    )


@router.get(
    "/profile", 
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_200_OK
)
def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch the currently authenticated user's profile metadata records.
    """
    try:
        logger.info(f"👉 DOCKER DEBUG USER: {current_user.user_id}")
    except AttributeError:
        logger.info(f"👉 DOCKER DEBUG USER: {getattr(current_user, '__dict__', current_user)}")

    user_db = UserService.get_user_by_id(db=db, user_id=current_user.user_id)
    return APIResponse.success(
        code=200,
        message="Authenticated profile metrics retrieved successfully",
        data=UserResponseData.model_validate(user_db)
    )


@router.put(
    "/profile", 
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_200_OK
)
def update_current_user_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the authenticated user's profile details.
    """
    current_user_id = current_user.user_id
    updated_user_db = UserService.update_user(
        db=db, 
        user_id=current_user.user_id, 
        user_in=payload, 
        current_user_id=current_user_id
    )
    
    return APIResponse.success(
        code=200,
        message="User profile and exclusive role configuration synchronized successfully",
        data=UserResponseData.model_validate(updated_user_db)
    )


# =========================================================================
# 2. DYNAMIC PATH VARIABLE ROUTING (Must be declared last!)
# =========================================================================

@router.get(
    "/{user_id}", 
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_200_OK
)
def get_user_details(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:view_user"))
):
    """
    Retrieve comprehensive profile details for a specific user, including their mapped role.
    """
    user_db = UserService.get_user_by_id(db=db, user_id=user_id)
    return APIResponse.success(
        code=200,
        message="User details retrieved successfully",
        data=UserResponseData.model_validate(user_db)
    )


@router.put(
    "/{user_id}", 
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_200_OK
)
def update_user(
    user_id: UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:view_user","users:update_user"))
):
    """
    Modify core account metrics and exclusive operational security roles matrix structures.
    """
    current_user_id = current_user.user_id # Integrated with Auth later

    updated_user_db = UserService.update_user(
        db=db, 
        user_id=user_id, 
        user_in=payload, 
        current_user_id=current_user_id
    )
    
    return APIResponse.success(
        code=200,
        message="User profile and exclusive role configuration synchronized successfully",
        data=UserResponseData.model_validate(updated_user_db)
    )


@router.delete(
    "/{user_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:view_user","users:delete_users"))
):
    """
    Permanently purge a user profile record completely.
    """
    UserService.delete_user(db=db, user_id=user_id)
    return APIResponse.success(
        code=200,
        message="User profile removed successfully",
        data={}
    )
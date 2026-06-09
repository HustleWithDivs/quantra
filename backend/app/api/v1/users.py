from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.user_schema import UserRead, UserCreate, UserResponseData, UserUpdate
from app.services.user_service import UserService
from app.core.database import get_db
from app.core.dependency import PermissionChecker

router = APIRouter(prefix="/users", tags=["Users"])

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
            offset=offset, 
            is_active=is_active, 
            search=search
        )
        
        # Mapping executes model_validate which handles flattening the roles array automatically
        users_data = [UserRead.model_validate(user) for user in users_db]
        
        return APIResponse.success(
            code=200,
            message="User directory with role assignments retrieved successfully",
            data=users_data
        )
        
    except Exception as e:
        return APIResponse.fail(
            code=500,
            message=f"Failed to fetch user list: {str(e)}"
        )

@router.post(
    "", 
    response_model=APIResponse[UserResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("users:create_user"))
):
    """
    Register a new system user profile and map initial authorization access capabilities.
    """
    #current_user_id = None # Connected to JWT lookup later
    
    new_user_db = UserService.create_user_with_roles(
        db=db, 
        user_in=payload, 
        current_user_id=current_user_id
    )
    
    response_payload = UserResponseData.model_validate(new_user_db)
    
    return APIResponse.success(
        code=201,
        message="User profile registered and roles assigned successfully",
        data=response_payload
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
    Update a user's core credentials and reassign their unique authorization role.
    """
    current_user_id = None # Connected to auth middleware later
    
    updated_user_db = UserService.update_user(
        db=db, 
        user_id=user_id, 
        role_in=payload, # Maps to user_in parameter
        current_user_id=current_user_id
    )
    
    return APIResponse.success(
        code=200,
        message="User profile and exclusive role configuration synchronized successfully",
        data=UserResponseData.model_validate(updated_user_db)
    )
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
    Permanently delete a user account and revoke all system access privileges.
    """
    UserService.delete_user(db=db, user_id=user_id)
    return APIResponse.success(
        code=200,
        message="User account and role bindings permanently purged",
        data={}
    )
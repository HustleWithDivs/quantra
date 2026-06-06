from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.schemas.response_schema import APIResponse
from app.models.user_model import User
from app.schemas.role_schema import RoleRead, RoleCreate, RoleResponseData, RoleDetailsRead, RoleUpdate
from app.services.role_service import RoleService
from app.core.database import get_db  # Database session generator
from app.core.dependency import  PermissionChecker

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get(
    "", 
    response_model=APIResponse[List[RoleRead]],
    status_code=status.HTTP_200_OK,
)
def list_roles(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:view_role"))
):
    try:
        # 1. Fetching roles using the Service Layer
        roles_db = RoleService.get_all_roles(
            db=db, 
            limit=limit, 
            offset=offset, 
            is_active=is_active, 
            search=search
        )
        
        # 2. Parsing to Pydantic objects for type-safe validation
        roles_data = [RoleRead.model_validate(role) for role in roles_db]
        
        # 3. Returning using your custom enterprise response schema
        return APIResponse.success(
            code=200,
            message="Roles retrieved successfully",
            data=roles_data
        )
        
    except Exception as e:
        return APIResponse.fail(
            code=500,
            message=f"Failed to fetch roles: {str(e)}"
        )

@router.post(
    "", 
    response_model=APIResponse[RoleResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_role(
    payload: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:create_role"))
):

    """
    Create a brand new role and map existing system permissions to it.
    Aborts automatically if any invalid permission ID is passed.
    """
    # Placeholder current_user_id; will be wired into JWT dependency later
    current_user_id = None 
    
    # The service layer handles verification and atomic commits/rollbacks
    new_role_db = RoleService.create_role_with_permissions(
        db=db, 
        role_in=payload, 
        current_user_id=current_user_id
    )
    
    # Parse data structure to match Pydantic expectation
    response_data = RoleResponseData.model_validate(new_role_db)
    
    return APIResponse.success(
        code=201,
        message="Role and its corresponding permissions mapped successfully",
        data=response_data
    )

@router.get(
    "/{role_id}", 
    response_model=APIResponse[RoleDetailsRead],
    status_code=status.HTTP_200_OK
)
def get_role_details(
    role_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:view_role"))
):
    """
    Retrieve comprehensive details for a specific role including its assigned permissions.
    """
    # The service layer fetches the record or raises a 404 if missing
    role_db = RoleService.get_role_by_id(db=db, role_id=role_id)
    
    # Formats the data (including nested permissions) safely into our Pydantic structure
    response_data = RoleDetailsRead.model_validate(role_db)
    
    return APIResponse.success(
        code=200,
        message="Role details and permissions retrieved successfully",
        data=response_data
    )
@router.put(
    "/{role_id}", 
    response_model=APIResponse[RoleDetailsRead],
    status_code=status.HTTP_200_OK
)
def update_role(
    role_id: UUID,
    payload: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:view_role","roles:update_role"))
):
    """
    Update basic role parameters and synchronize its mapping permissions.
    """
    current_user_id = None # Integrated with Auth later
    updated_role = RoleService.update_role(db=db, role_id=role_id, role_in=payload, current_user_id=current_user_id)
    
    return APIResponse.success(
        code=200,
        message="Role modified and permissions synchronized successfully",
        data=RoleDetailsRead.model_validate(updated_role)
    )


@router.delete(
    "/{role_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_role(
    role_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:view_role","roles:delete_role"))
):
    """
    Permanently purge a system role along with its authorization mappings.
    """
    RoleService.delete_role(db=db, role_id=role_id)
    
    return APIResponse.success(
        code=200,
        message="Role and associated bindings deleted successfully",
        data={}
    )
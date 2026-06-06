from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.permission_schema import PermissionRead
from app.services.permission_service import PermissionService
from app.core.database import get_db
from app.core.dependency import  PermissionChecker

router = APIRouter(prefix="/permissions", tags=["Permissions"])

@router.get(
    "", 
    response_model=APIResponse[List[PermissionRead]],
    status_code=status.HTTP_200_OK
)
def list_permissions(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("roles:view_role","roles:create_role","roles:update_role"))
):
    """
    Fetch a flat list of system permissions for role mapping.
    """
    try:
        permissions_db = PermissionService.get_all_permissions(
            db=db, 
            limit=limit, 
            offset=offset, 
            is_active=is_active, 
            search=search
        )
        
        permissions_data = [PermissionRead.model_validate(p) for p in permissions_db]
        
        return APIResponse.success(
            code=200,
            message="Permissions retrieved successfully",
            data=permissions_data
        )
        
    except Exception as e:
        return APIResponse.fail(
            code=500,
            message=f"Failed to fetch permissions: {str(e)}"
        )
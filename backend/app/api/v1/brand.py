from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.brand_service import BrandService
from app.schemas.response_schema import APIResponse
from app.schemas.brand_schema import BrandRead



router = APIRouter(prefix="/brand", tags=["Brands"])
@router.get("", response_model=APIResponse[List[BrandRead]])
def list_brand(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    brand = BrandService.get_all_brand(db, limit, offset, search)
    data = [BrandRead.model_validate(b) for b in brand]
    return APIResponse.success(message="Brand records fetched successfully", data=data)


@router.delete(
    "/{user_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_brand(
    user_id: UUID,
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("users:view_user","users:delete_users"))
):
    """
    Permanently delete a brand account and revoke all system access privileges.
    """
    BrandService.delete_brand(db=db, user_id=user_id)
    return APIResponse.success(
        code=200,
        message="Brand permanently purged",
        data={}
    )
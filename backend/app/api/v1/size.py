from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.size_service import SizeService
from app.schemas.response_schema import APIResponse
from app.schemas.size_schema import SizeRead, SizeCreate,SizeUpdate



router = APIRouter(prefix="/size", tags=["Size"])
@router.get("", response_model=APIResponse[List[SizeRead]])
def list_size(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    size = SizeService.get_all_size(db, limit, offset, search)
    data = [SizeRead.model_validate(b) for b in size]
    return APIResponse.success(message="size records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[SizeRead])
def create_size(
    payload: SizeCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    size_obj= SizeService.create_size(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SizeRead.model_validate(size_obj)

    return APIResponse.success(
        code=201,
        message="size created successfully",
        data=response_data
    )

@router.put(
    "/{size_id}",
    response_model=APIResponse[SizeRead],
    status_code=status.HTTP_200_OK
)
def update_size(
    size_id: UUID,
    payload: SizeUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing size.
    """

    updated_size = SizeService.update_size(
        db=db,
        size_id=size_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = SizeRead.model_validate(updated_size)

    return APIResponse.success(
        code=200,
        message="size synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{size_id}", response_model=APIResponse[dict])
def delete_size(
    size_id: UUID,
    db: Session = Depends(get_db),
):
    SizeService.delete_size(db=db, size_id=size_id)

    return APIResponse.success(
        code=200,
        message="size deleted successfully",
        data={}
    )
# from app.core.master_router import create_master_router

# router = create_master_router("size")
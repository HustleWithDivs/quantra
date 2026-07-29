from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.color_service import ColorService
from app.schemas.response_schema import APIResponse
from app.schemas.color_schema import ColorRead, ColorCreate,ColorUpdate



router = APIRouter(prefix="/color", tags=["Colors"])
@router.get("", response_model=APIResponse[List[ColorRead]])
def list_color(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    color = ColorService.get_all_color(db, limit, offset, search)
    data = [ColorRead.model_validate(b) for b in color]
    return APIResponse.success(message="Color records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[ColorRead])
def create_color(
    payload: ColorCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    color_obj = ColorService.create_color(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = ColorRead.model_validate(color_obj)

    return APIResponse.success(
        code=201,
        message="Color created successfully",
        data=response_data
    )

@router.put(
    "/{color_id}",
    response_model=APIResponse[ColorRead],
    status_code=status.HTTP_200_OK
)
def update_color(
    color_id: UUID,
    payload: ColorUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing Color.
    """

    updated_Color = ColorService.update_color(
        db=db,
        color_id=color_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = ColorRead.model_validate(updated_Color)

    return APIResponse.success(
        code=200,
        message="Color synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{color_id}", response_model=APIResponse[dict])
def delete_color(
    color_id: UUID,
    db: Session = Depends(get_db),
):
    ColorService.delete_color(db=db, color_id=color_id)

    return APIResponse.success(
        code=200,
        message="Color deleted successfully",
        data={}
    )

# from app.core.master_router import create_master_router

# router = create_master_router("color")
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master.material_service import MaterialService
from app.schemas.response_schema import APIResponse
from app.schemas.master.material_schema import MaterialRead, MaterialCreate,MaterialUpdate



router = APIRouter(prefix="/material", tags=["Material"])
@router.get("", response_model=APIResponse[List[MaterialRead]])
def list_material(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    material = MaterialService.get_all_material(db, limit, offset, search)
    data = [MaterialRead.model_validate(b) for b in material]
    return APIResponse.success(message="material records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[MaterialRead])
def create_material(
    payload: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    material = MaterialService.create_material(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = MaterialRead.model_validate(material)

    return APIResponse.success(
        code=201,
        message="material created successfully",
        data=response_data
    )

@router.put(
    "/{material_id}",
    response_model=APIResponse[MaterialRead],
    status_code=status.HTTP_200_OK
)
def update_material(
    material_id: UUID,
    payload: MaterialUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing material.
    """

    updated_material = MaterialService.update_material(
        db=db,
        material_id=material_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = MaterialRead.model_validate(updated_material)

    return APIResponse.success(
        code=200,
        message="Material synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{material_id}", response_model=APIResponse[dict])
def delete_material(
    material_id: UUID,
    db: Session = Depends(get_db),
):
    MaterialService.delete_material(db=db, material_id=material_id)

    return APIResponse.success(
        code=200,
        message="material deleted successfully",
        data={}
    )

# from app.core.master_router import create_master_router

# router = create_master_router("material")
# from app.core.master_router import create_master_router

# router = create_master_router("material")
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.material_service import MaterialService
from app.schemas.response_schema import APIResponse
from app.schemas.material_schema import MaterialRead, MaterialCreate, MaterialUpdate,MaterialResponseData
from app.core.dependency import PermissionChecker, get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/material", tags=["Materials"])
# =========================
# LIST 
# =========================
@router.get("", response_model=APIResponse[List[MaterialRead]],
status_code=status.HTTP_200_OK
)
def list_material(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("material:view_material"))
):
    """
    Get list of all materials.
    """
    try:
        materials_db = MaterialService.get_all_material(
            db=db, 
            limit=limit, 
            offset=offset,
            is_active=is_active, 
            search=search
        )
        materials_data = [MaterialRead.model_validate(materials) for materials in materials_db]
        return APIResponse.success(data=materials_data)
    except Exception as e:
        return APIResponse.fail(message=str(e))


@router.get(
    "/{material_id}", 
    response_model=APIResponse[MaterialResponseData],
    status_code=status.HTTP_200_OK
)
def get_material_details(
    material_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("material:view_material"))
):
    """
    Retrieve comprehensive business category details for a specific material id.
    """
    material_db = MaterialService.get_material_by_id(db=db, material_id=material_id)
    return APIResponse.success(
        code=200,
        message="Material retrieved successfully",
        data=MaterialResponseData.model_validate(material_db)
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[MaterialRead])
def create_material(
    payload: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("material:create_material"))
):
    
    current_user_id = current_user.user_id # Integrated with Auth later
    material = MaterialService.create_material(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = MaterialRead.model_validate(material)

    return APIResponse.success(
        code=201,
        message="Material created successfully",
        data=response_data
    )

@router.put(
    "/{material_id}",
    response_model=APIResponse[MaterialRead],
    status_code=status.HTTP_200_OK
)
def update_material(
    material_id: UUID,
    material_in: MaterialUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing material.
    """

    updated_material = MaterialService.update_material(
        db=db,
        material_id=material_id,
        material_in=material_in,
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
        message="Material deleted successfully",
        data={}
    )
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.department_service import DepartmentService
from app.schemas.response_schema import APIResponse
from app.schemas.department_schema import DepartmentRead, DepartmentCreate,DepartmentUpdate



router = APIRouter(prefix="/department", tags=["Department"])
@router.get("", response_model=APIResponse[List[DepartmentRead]])
def list_department(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    # current_user: User = Depends(PermissionChecker("customers:view_customer"))
):
    """Get global directory list of all registered customers."""
    department = DepartmentService.get_all_department(db, limit, offset, search)
    data = [DepartmentRead.model_validate(b) for b in department]
    return APIResponse.success(message="department records fetched successfully", data=data)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[DepartmentRead])
def create_department(
    payload: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT later
):
    department = DepartmentService.create_department(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = DepartmentRead.model_validate(department)

    return APIResponse.success(
        code=201,
        message="department created successfully",
        data=response_data
    )

@router.put(
    "/{department_id}",
    response_model=APIResponse[DepartmentRead],
    status_code=status.HTTP_200_OK
)
def update_department(
    department_id: UUID,
    payload: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing department.
    """

    updated_department = DepartmentService.update_department(
        db=db,
        department_id=department_id,
        payload=payload,
        current_user_id=current_user
    )

    response_data = DepartmentRead.model_validate(updated_department)

    return APIResponse.success(
        code=200,
        message="department synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{department_id}", response_model=APIResponse[dict])
def delete_department(
    department_id: UUID,
    db: Session = Depends(get_db),
):
    DepartmentService.delete_department(db=db, department_id=department_id)

    return APIResponse.success(
        code=200,
        message="department deleted successfully",
        data={}
    )
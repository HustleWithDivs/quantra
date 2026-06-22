# app/api/v1/departments.py
import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.department_scehma import DepartmentRead, DepartmentCreate, DepartmentResponseData, DepartmentUpdate
from app.services.department_service import DepartmentService
from app.core.database import get_db
from app.core.dependency import PermissionChecker, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/departments", tags=["Departments"])

@router.get(
    "", 
    response_model=APIResponse[List[DepartmentRead]],
    status_code=status.HTTP_200_OK
)
def list_departments(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("department:view_department"))
):
    try:
        departments_db = DepartmentService.get_all_departments(
            db=db, limit=limit, offset=offset, is_active=is_active, search=search
        )
        departments_data = [DepartmentRead.model_validate(d) for d in departments_db]
        return APIResponse.success(
            code=200,
            message="Departments retrieved successfully",
            data=departments_data
        )
    except Exception as e:
        logger.error(f"Error querying departments matrix: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal processing fault.")

@router.get(
    "/{department_id}", 
    response_model=APIResponse[DepartmentRead],
    status_code=status.HTTP_200_OK
)
def get_department(
    department_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("department:view_department"))
):
    department_db = DepartmentService.get_department_by_id(db=db, department_id=department_id)
    return APIResponse.success(
        code=200,
        message="Department retrieved successfully",
        data=DepartmentRead.model_validate(department_db)
    )

@router.post(
    "", 
    response_model=APIResponse[DepartmentResponseData],
    status_code=status.HTTP_201_CREATED
)
def create_department(
    payload: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("department:create_department"))
):
    new_department = DepartmentService.create_department(
        db=db, department_in=payload, current_user_id=current_user.user_id
    )
    return APIResponse.success(
        code=201,
        message="Department provisioned successfully",
        data=DepartmentResponseData.model_validate(new_department)
    )

@router.put(
    "/{department_id}", 
    response_model=APIResponse[DepartmentResponseData],
    status_code=status.HTTP_200_OK
)
def update_department(
    department_id: UUID,
    payload: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("department:update_department"))
):
    updated_department = DepartmentService.update_department(
        db=db, 
        department_id=department_id, 
        department_in=payload, 
        current_user_id=current_user.user_id
    )
    return APIResponse.success(
        code=200,
        message="Department attributes updated successfully",
        data=DepartmentResponseData.model_validate(updated_department)
    )

@router.delete(
    "/{department_id}", 
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK
)
def delete_department(
    department_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("department:delete_department"))
):
    DepartmentService.delete_department(db=db, department_id=department_id)
    return APIResponse.success(
        code=200,
        message="Department purged successfully",
        data={}
    )
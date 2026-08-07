# app/services/department_service.py
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.department_model import Department
from app.models.business_category_model import BusinessCategory
from app.schemas.department_scehma import DepartmentCreate, DepartmentUpdate
from sqlalchemy.orm import Session, joinedload  # ADDED: joinedload

class DepartmentService:
    @staticmethod
    def get_all_departments(
        db: Session, 
        limit: int = 100, 
        offset: int = 0, 
        is_active: Optional[bool] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Department], int]:
        # query = db.query(Department)
        query = db.query(Department).options(joinedload(Department.business_category))
        if is_active is not None:
            query = query.filter(Department.is_active == is_active)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Department.department_name.ilike(search_filter),
                    Department.department_description.ilike(search_filter),
                    
                )
            )
        total_count = query.count()
        items =  query.order_by(Department.created_at.desc()).offset(offset).limit(limit).all()
        return items, total_count

    @staticmethod
    def get_department_by_id(db: Session, department_id: UUID) -> Department:
        # department = db.query(Department).filter(Department.department_id == department_id).first()
        department = (
            db.query(Department)
            .options(joinedload(Department.business_category))
            .filter(Department.department_id == department_id)
            .first()
        )
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with ID '{department_id}' could not be found."
            )
        return department

    @staticmethod
    def create_department(db: Session, department_in: DepartmentCreate, current_user_id: UUID) -> Department:
        # Verify foreign key reference exists
        business_cat = db.query(BusinessCategory).filter(
            BusinessCategory.business_category_id == department_in.business_category_id
        ).first()
        if not business_cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"BusinessCategory with ID '{department_in.business_category_id}' does not exist."
            )

        db_department = Department(
            business_category_id=department_in.business_category_id,
            department_name=department_in.department_name,
            department_description=department_in.department_description,
            is_active=department_in.is_active,
            created_by=current_user_id
        )
        db.add(db_department)
        db.commit()
        db.refresh(db_department)
        return db_department

    @staticmethod
    def update_department(db: Session, department_id: UUID, department_in: DepartmentUpdate, current_user_id: UUID) -> Department:
        db_department = DepartmentService.get_department_by_id(db, department_id)
        
        if department_in.business_category_id is not None:
            business_cat = db.query(BusinessCategory).filter(
                BusinessCategory.business_category_id == department_in.business_category_id
            ).first()
            if not business_cat:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"BusinessCategory with ID '{department_in.business_category_id}' does not exist."
                )

        update_data = department_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_department, field, value)
            
        db_department.modified_at = datetime.utcnow()
        db_department.modified_by = current_user_id
        
        db.commit()
        db.refresh(db_department)
        return db_department

    @staticmethod
    def validate_department_deletion(db: Session, department_id: UUID) -> None:
        """
        Validates if a department can be safely deleted.
        Blocks deletion if any category relationships are attached to it.
        """
        # Query the explicit bridge entity to look for active linkages
        from app.models.category_model import DepartmentCategory

        has_associated_categories = db.query(DepartmentCategory).filter(
            DepartmentCategory.department_id == department_id
        ).first()
        
        if has_associated_categories:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Deletion blocked. Active categories are currently assigned to this Department."
            )

    @staticmethod
    def delete_department(db: Session, department_id: UUID) -> None:
        db_department = DepartmentService.get_department_by_id(db, department_id)
        
        # Enforce validation check before calling db.delete()
        DepartmentService.validate_department_deletion(db, department_id)
        
        try:
            db.delete(db_department)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete department due to a database error: {str(e)}"
            )


   
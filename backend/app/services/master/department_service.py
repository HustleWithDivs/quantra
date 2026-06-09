from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.department_model import Department
from app.schemas.master.department_schema import DepartmentRead ,DepartmentCreate,DepartmentUpdate
from datetime import datetime
from app.models.master.business_category_model import BusinessCategory

class DepartmentService:

    @staticmethod
    def get_all_department(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Department]:
        query = db.query(Department)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Department.department_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_department(db: Session, payload: DepartmentCreate, current_user_id: UUID = None):
        department_obj = Department(
            business_category_id=payload.business_category_id, 
            department_name=payload.department_name,
            department_description=payload.department_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        # validate FK exists (recommended)
        category = db.query(BusinessCategory).filter(
            BusinessCategory.business_category_id == department_obj.business_category_id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="Invalid business category")    


        db.add(department_obj)
        db.commit()
        db.refresh(department_obj)
        return department_obj


    @staticmethod
    def update_department(
        db: Session,
        department_id: UUID,
        payload: DepartmentUpdate,
        current_user_id: UUID = None
    ):
        dept_obj = db.query(Department).filter(Department.department_id == department_id).first()

        if not dept_obj:
            raise Exception("Department not found")

        # Update only provided fields
        if payload.department_name is not None:
            dept_obj.department_name = payload.department_name

        if payload.department_description is not None:
            dept_obj.department_description = payload.department_description

        if payload.is_active is not None:
            dept_obj.is_active = payload.is_active

        if payload.business_category_id is not None:
            dept_obj.business_category_id = payload.business_category_id

        # validate FK exists (recommended)
        category = db.query(BusinessCategory).filter(
            BusinessCategory.business_category_id == payload.business_category_id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="Invalid business category")    

        
        dept_obj.modified_by = current_user_id
        dept_obj.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(dept_obj)

        return dept_obj

    @staticmethod
    def delete_department(db: Session, department_id: UUID):
        department = db.query(Department).filter(Department.department_id == department_id).first()

        if not department:
            raise Exception("department not found")

        db.delete(department)
        db.commit()
        return True

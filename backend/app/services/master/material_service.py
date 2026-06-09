from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.material_model import Material
from app.schemas.master.material_schema import MaterialRead ,MaterialCreate,MaterialUpdate
from datetime import datetime

class MaterialService:

    @staticmethod
    def get_all_material(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Material]:
        query = db.query(Material)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Material.material_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_material(db: Session, payload: MaterialCreate, current_user_id: UUID = None):
        new_category = Material(
            material_name=payload.material_name,
            material_description=payload.material_description,
            is_active=payload.is_active if hasattr(payload, "is_active") else True,
            created_by=current_user_id
        )

        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category


    @staticmethod
    def update_material(
        db: Session,
        material_id: UUID,
        payload: MaterialUpdate,
        current_user_id: UUID = None
    ):
        material = db.query(Material).filter(Material.material_id == material_id).first()

        if not material:
            raise Exception("material not found")

        # Update only provided fields
        if payload.material_name is not None:
            material.material_name = payload.material_name

        if payload.material_description is not None:
            material.material_description = payload.material_description

        if payload.is_active is not None:
            material.is_active = payload.is_active

        #  audit fields (based on your model)
        material.modified_by = current_user_id
        material.modified_at = datetime.utcnow()

        db.commit()
        db.refresh(material)

        return material

    @staticmethod
    def delete_material(db: Session, material_id: UUID):
        material = db.query(Material).filter(Material.material_id == material_id).first()

        if not material:
            raise Exception("material not found")

        db.delete(material)
        db.commit()
        return True

from uuid import UUID
from typing import List, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.material_model import Material
from app.schemas.material_schema import MaterialRead ,MaterialCreate,MaterialUpdate
from datetime import datetime

class MaterialService:

    @staticmethod
    def get_all_material(
        db: Session, 
        limit: int = 100,
         offset: int = 0,
         is_active: Optional[bool] = None,
          search: Optional[str] = None
        ) -> Tuple[List[Material], int]:
        query = db.query(Material)

        if is_active is not None:
            query = query.filter(Material.is_active == is_active)
       

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Material.material_name.ilike(search_filter),
                    Material.material_description.ilike(search_filter),
               )
            )
        total_count = query.count()
        items =  query.order_by(Material.created_at.desc()).offset(offset).limit(limit).all()
        return items, total_count

    @staticmethod
    def get_material_by_id(db: Session, material_id: UUID) -> Material:
        material = db.query(Material).filter(Material.material_id == material_id).first()
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Material with ID '{material_id}' could not be found."
            )
        return material
    

    @staticmethod
    def create_material(db: Session, payload: MaterialCreate, current_user_id: UUID = None):
        # 1. Verify  uniqueness
        existing_name = db.query(Material).filter(Material.material_name == payload.material_name).first()
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A material account with the name '{payload.material_name}' already exists."
            )

      
        try: 
            material = Material(
                material_name=payload.material_name,
                material_description=payload.material_description,
                is_active=payload.is_active if hasattr(payload, "is_active") else True,
                created_by=current_user_id.user_id
            )

            db.add(material)
            db.commit()
            db.refresh(material)
            return material

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create material: {str(e)}"
            )    


    @staticmethod
    def update_material(
        db: Session,
        material_id: UUID,
        material_in: MaterialUpdate,
        current_user_id: UUID = None
    ):
         # 1. Fetch material or raise 404
        material = db.query(Material).filter(Material.material_id == material_id).first()
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Material with ID '{material_id}' could not be found."
            )
        
        # 2. Check name unique constraint if it's changing
        if material_in.material_name and material_in.material_name != material.material_name:
            name_check = db.query(Material).filter(Material.material_name == material_in.material_name).first()
            if name_check:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Name '{material_in.material_name}' is already in use by another account."
                )
        try:
            # 4. Update basic business category details
            update_data = material_in.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(material, key, value)
            
            material.modified_at = datetime.utcnow()
            material.modified_by = current_user_id
            
            db.commit()
            db.refresh(material)
            return material
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update material record: {str(e)}"
            )
        


    @staticmethod
    def delete_material(db: Session, material_id: UUID) -> None:
        """
        Permanently removes a material record after ensuring no active child departments exist.
        """
        material = db.query(Material).filter(
            Material.material_id == material_id
        ).first()
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Material with ID '{material_id}' could not be found."
            )
            
            
        try:
            # Erase the core business category record safely
            db.delete(material)
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete material due to a database error: {str(e)}"
            )

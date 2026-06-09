from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.size_model import Size
from app.schemas.master.size_schema import SizeRead ,SizeCreate,SizeUpdate
from datetime import datetime

class SizeService:

    @staticmethod
    def get_all_size(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Size]:
        query = db.query(Size)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Size.size_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_size(db: Session, payload: SizeCreate, current_user_id: UUID = None):
        new_size = Size(
            size_name=payload.size_name,
            size_description=payload.size_description,
                  )

        db.add(new_size)
        db.commit()
        db.refresh(new_size)
        return new_size


    @staticmethod
    def update_size(
        db: Session,
        size_id: UUID,
        payload: SizeUpdate,
        current_user_id: UUID = None
    ):
        size = db.query(Size).filter(Size.size_id == size_id).first()

        if not size:
            raise Exception("size not found")

        # Update only provided fields
        if payload.size_name is not None:
            size.size_name = payload.size_name

        if payload.size_description is not None:
            size.size_description = payload.size_description

        

        db.commit()
        db.refresh(size)

        return size

    @staticmethod
    def delete_size(db: Session, size_id: UUID):
        size = db.query(Size).filter(Size.size_id == size_id).first()

        if not size:
            raise Exception("size not found")

        db.delete(size)
        db.commit()
        return True

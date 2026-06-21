from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.master.color_model import Color
from app.schemas.master.color_schema import ColorRead ,ColorCreate,ColorUpdate
from datetime import datetime

class ColorService:

    @staticmethod
    def get_all_color(
        db: Session, limit: int = 100, offset: int = 0, search: Optional[str] = None
    ) -> List[Color]:
        query = db.query(Color)
        if search:
            sf = f"%{search}%"
            query = query.filter(
                or_(Color.size_name.ilike(sf))
            )
          
        return query.offset(offset).limit(limit).all()
     
    @staticmethod
    def create_color(db: Session, payload: ColorCreate, current_user_id: UUID = None):
        new_color = Color(
            color_name=payload.color_name,
            color_description=payload.color_description,
            
        )

        db.add(new_color)
        db.commit()
        db.refresh(new_color)
        return new_color


    @staticmethod
    def update_color(
        db: Session,
        color_id: UUID,
        payload: ColorUpdate,
        current_user_id: UUID = None
    ):
        color = db.query(Color).filter(Color.color_id == color_id).first()

        if not color:
            raise Exception("color not found")

        # Update only provided fields
        if payload.color_name is not None:
            color.color_name = payload.color_name

        if payload.color_description is not None:
            color.color_description = payload.color_description

        

        db.commit()
        db.refresh(color)

        return color

    @staticmethod
    def delete_color(db: Session, color_id: UUID):
        color = db.query(Color).filter(Color.color_id == color_id).first()

        if not color:
            raise Exception("color not found")

        db.delete(color)
        db.commit()
        return True

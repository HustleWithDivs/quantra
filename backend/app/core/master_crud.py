from sqlalchemy.orm import Session
from typing import Any, Dict, List, Optional, Type
from pydantic import BaseModel

class MasterCRUD:
    """
    Generic CRUD handler for master tables like:
    Color, Size, Material, etc.
    """

    def __init__(self, model: Type[Any], id_field: str, search_fields: List[str]):
        self.model = model
        self.id_field = id_field
        self.search_fields = search_fields

    # -------------------------
    # CREATE
    # -------------------------
    def create(self, db: Session, obj_in: BaseModel):
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # -------------------------
    # GET BY ID
    # -------------------------
    def get(self, db: Session, obj_id: Any):
        return db.query(self.model).filter(
            getattr(self.model, self.id_field) == obj_id
        ).first()

    # -------------------------
    # GET ALL (with optional pagination)
    # -------------------------
    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(self.model).offset(skip).limit(limit).all()

    # -------------------------
    # UPDATE
    # -------------------------
    def update(self, db: Session, obj_id: Any, obj_in: Dict[str, Any]):
        db_obj = self.get(db, obj_id)

        if not db_obj:
            return None

        for key, value in obj_in.items():
            if value is not None:
                setattr(db_obj, key, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    # -------------------------
    # DELETE
    # -------------------------
    def delete(self, db: Session, obj_id: Any):
        db_obj = self.get(db, obj_id)

        if not db_obj:
            return None

        db.delete(db_obj)
        db.commit()
        return True

    # -------------------------
    # SEARCH (basic LIKE search)
    # -------------------------
    def search(self, db: Session, keyword: str):
        if not keyword:
            return self.get_all(db)

        from sqlalchemy import or_

        filters = []
        for field in self.search_fields:
            column = getattr(self.model, field)
            filters.append(column.ilike(f"%{keyword}%"))

        return db.query(self.model).filter(or_(*filters)).all()
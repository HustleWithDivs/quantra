from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class SubCategoryRead(BaseModel):
    sub_category_id: UUID
    sub_category_name: str
    sub_category_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class SubCategoryCreate(BaseModel):
    sub_category_name: str = Field(..., max_length=100)
    sub_category_description: Optional[str] = Field(None, max_length=255)
    is_active: bool = True
    category_ids: List[UUID] = Field(default_factory=list)


class SubCategoryUpdate(BaseModel):
    sub_category_name: Optional[str] = Field(None, max_length=100)
    sub_category_description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None
    category_ids: Optional[List[UUID]] = None


class SubCategoryResponseData(BaseModel):
    sub_category_id: UUID
    sub_category_name: str
    sub_category_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    categories: List[UUID] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_category_ids(cls, data):
        """Flattens relationship models to return plain category UUID strings to the frontend."""
        if hasattr(data, "categories") and data.categories:
            data_dict = {c.name: getattr(data, c.name) for c in data.__table__.columns}
            data_dict["categories"] = [cat.category_id for cat in data.categories]
            return data_dict
        return data
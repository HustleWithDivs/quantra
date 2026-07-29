from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class ProductTypeRead(BaseModel):
    product_type_id: UUID
    product_type: str
    product_type_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None
    subcategories: List[UUID] = []
    subcategory_names: List[str] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_subcategories(cls, data):
        """Flattens SQLAlchemy model relations into UUIDs and name strings."""
        if hasattr(data, "sub_categories") and data.sub_categories:
            data_dict = {c.name: getattr(data, c.name) for c in data.__table__.columns}
            data_dict["subcategories"] = [sc.sub_category_id for sc in data.sub_categories]
            data_dict["subcategory_names"] = [sc.sub_category_name for sc in data.sub_categories]
            return data_dict
        return data


class ProductTypeCreate(BaseModel):
    product_type: str = Field(..., max_length=100)
    product_type_description: Optional[str] = Field(None, max_length=255)
    is_active: bool = True
    sub_category_ids: List[UUID] = Field(default_factory=list)


class ProductTypeUpdate(BaseModel):
    product_type: Optional[str] = Field(None, max_length=100)
    product_type_description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None
    sub_category_ids: Optional[List[UUID]] = None


class ProductTypeResponseData(BaseModel):
    product_type_id: UUID
    product_type: str
    product_type_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    subcategories: List[UUID] = []
    subcategory_names: List[str] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_sub_category_ids(cls, data):
        """Flattens SQLAlchemy model relations into pure arrays of UUIDs and names."""
        if hasattr(data, "sub_categories") and data.sub_categories:
            data_dict = {c.name: getattr(data, c.name) for c in data.__table__.columns}
            data_dict["subcategories"] = [sc.sub_category_id for sc in data.sub_categories]
            data_dict["subcategory_names"] = [sc.sub_category_name for sc in data.sub_categories]
            return data_dict
        return data
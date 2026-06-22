from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator

class CategoryRead(BaseModel):
    category_id: UUID
    category_name: str
    category_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class CategoryCreate(BaseModel):
    category_name: str = Field(..., max_length=100)
    category_description: Optional[str] = Field(None, max_length=255)
    is_active: bool = True
    # Explicit list of department IDs to link this category to upon creation
    department_ids: List[UUID] = Field(default_factory=list)

class CategoryUpdate(BaseModel):
    category_name: Optional[str] = Field(None, max_length=100)
    category_description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None
    # Overwrites or manages current association matrix links if provided
    department_ids: Optional[List[UUID]] = None

class CategoryResponseData(BaseModel):
    category_id: UUID
    category_name: str
    category_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    departments: List[UUID] = []

    model_config = ConfigDict(from_attributes=True)
    
    @model_validator(mode="before")
    @classmethod
    def extract_department_ids(cls, data):
        # Flattens database ORM objects into a simple clean list of UUID strings for the API output
        if hasattr(data, "departments") and data.departments:
            data_dict = {c.name: getattr(data, c.name) for c in data.__table__.columns}
            data_dict["departments"] = [dept.department_id for dept in data.departments]
            return data_dict
        return data
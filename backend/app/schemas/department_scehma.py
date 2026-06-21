# app/schemas/department_schema.py
from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class DepartmentRead(BaseModel):
    department_id: UUID
    business_category_id: UUID
    department_name: str
    department_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class DepartmentCreate(BaseModel):
    business_category_id: UUID
    department_name: str = Field(..., max_length=100)
    department_description: Optional[str] = Field(None, max_length=255)
    is_active: bool = True

class DepartmentUpdate(BaseModel):
    business_category_id: Optional[UUID] = None
    department_name: Optional[str] = Field(None, max_length=100)
    department_description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None

class DepartmentResponseData(BaseModel):
    department_id: UUID
    business_category_id: UUID
    department_name: str
    department_description: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict ,Field

# For Directory Listing (Lightweight)
class DepartmentRead(BaseModel):
    department_id: UUID
    business_category_id: UUID
    department_name: str
    department_description: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DepartmentCreate(BaseModel):
    business_category_id: UUID = Field(...)
    department_name: str = Field(..., max_length=200, description="Unique name for the enterprise role")
    department_description: Optional[str] = None
    is_active: bool = True
    # permission_ids: List[UUID] = Field(default=[], description="List of existing permission IDs to map to this role")

# ─── NEW UPDATE SCHEMA ───
class DepartmentUpdate(BaseModel):
    business_category_id: Optional[UUID] = None
    department_name: Optional[str] = Field(None, max_length=200)
    department_description: Optional[str] = None
    is_active: Optional[bool] = None
    # permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
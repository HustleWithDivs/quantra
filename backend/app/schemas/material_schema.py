from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict ,Field

# For Directory Listing (Lightweight)
class MaterialRead(BaseModel):
    material_id: UUID
    material_name: str
    material_description: str
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MaterialResponseData(BaseModel):
    material_id: UUID
    material_name: str
    material_description: str
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)      

class MaterialCreate(BaseModel):
    material_name: str = Field(..., max_length=200, description="Unique name for the enterprise role")
    material_description: Optional[str] = None
    is_active: bool = True
    # permission_ids: List[UUID] = Field(default=[], description="List of existing permission IDs to map to this role")


class MaterialUpdate(BaseModel):
    material_name: Optional[str] = Field(None, max_length=200)
    material_description: Optional[str] = None
    is_active: Optional[bool] = None
    # permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
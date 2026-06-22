from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict ,Field

# For Directory Listing (Lightweight)
class ColorRead(BaseModel):
    color_id: UUID
    color_name: str
    color_description: str


    model_config = ConfigDict(from_attributes=True)

class ColorCreate(BaseModel):
    color_name: str = Field(..., max_length=200, description="Unique name for the enterprise role")
    color_description: Optional[str] = None
    
    # permission_ids: List[UUID] = Field(default=[], description="List of existing permission IDs to map to this role")

# ─── NEW UPDATE SCHEMA ───
class ColorUpdate(BaseModel):
    color_name: Optional[str] = Field(None, max_length=200)
    color_description: Optional[str] = None
    
    # permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
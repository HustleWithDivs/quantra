from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict ,Field

# For Directory Listing (Lightweight)
class SubCategoryRead(BaseModel):
    sub_category_id: UUID
    sub_category_name: str
    sub_category_description: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SubCategoryCreate(BaseModel):
    sub_category_name: str = Field(..., max_length=200, description="Unique name for the enterprise role")
    sub_category_description: Optional[str] = None
    is_active: bool = True
    # permission_ids: List[UUID] = Field(default=[], description="List of existing permission IDs to map to this role")

# ─── NEW UPDATE SCHEMA ───
class SubCategoryUpdate(BaseModel):
    sub_category_name: Optional[str] = Field(None, max_length=200)
    sub_category_description: Optional[str] = None
    is_active: Optional[bool] = None
    # permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
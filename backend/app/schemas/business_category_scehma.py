from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class BusinessCategoryRead(BaseModel):
    business_category_id: UUID
    business_category_name: str
    business_category_description: str
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True)

    
class BusinessCategoryCreate(BaseModel):
    business_category_name: str = Field(..., max_length=100)
    business_category_description: str = Field(..., max_length=100)
    is_active: bool = True
class BusinessCategoryResponseData(BaseModel):
    business_category_id: UUID
    business_category_name: str
    business_category_description: str
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BusinessCategoryUpdate(BaseModel):
    business_category_name: Optional[str] = Field(None, max_length=100)
    business_category_description: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None
  
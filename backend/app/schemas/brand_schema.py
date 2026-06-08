from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# For Directory Listing (Lightweight)
class BrandRead(BaseModel):
    brand_id: UUID
    brand_name: str
    description: str
    is_active: bool
    # created_at: datetime

    model_config = ConfigDict(from_attributes=True)
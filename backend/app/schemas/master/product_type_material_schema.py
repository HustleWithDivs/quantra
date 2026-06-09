from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict ,Field

# For Directory Listing (Lightweight)
class ProductTypeMaterialRead(BaseModel):
    material_id: UUID
    product_type_id: UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductTypeMaterialAssign(BaseModel):
    material_ids: List[UUID]
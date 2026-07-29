from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class PermissionRead(BaseModel):
    permission_id: UUID
    slug: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)
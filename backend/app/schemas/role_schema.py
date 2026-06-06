from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from app.schemas.permission_schema import PermissionRead

class RoleRead(BaseModel):
    role_id: int
    role_name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[int] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class RoleCreate(BaseModel):
    role_name: str = Field(..., max_length=200, description="Unique name for the enterprise role")
    description: Optional[str] = None
    is_active: bool = True
    permission_ids: List[UUID] = Field(default=[], description="List of existing permission IDs to map to this role")

class RoleResponseData(BaseModel):
    role_id: UUID
    role_name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class RoleDetailsRead(BaseModel):
    role_id: UUID
    role_name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None
    
    # Nesting the permissions schema we created earlier
    permissions: List[UUID] = []

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def model_validate(cls, obj, **kwargs):
        """Custom validator to flatten the relationship objects into an array of IDs"""
        instance = super().model_validate(obj, **kwargs)
        if hasattr(obj, 'permissions'):
            instance.permissions = [p.permission_id for p in obj.permissions]
        return instance


# ─── NEW UPDATE SCHEMA ───
class RoleUpdate(BaseModel):
    role_name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
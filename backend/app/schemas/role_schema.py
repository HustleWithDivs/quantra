from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field, model_validator
from uuid import UUID
from app.schemas.permission_schema import PermissionRead

class RoleRead(BaseModel):
    role_id: UUID
    role_name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None

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
    # Depending on your frontend needs, you might want names, UUIDs, or both:
    permissions: List[str] = []      # For showing names in a list
    permissions_id: List[UUID] = []  # For managing selections in a form component

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_permissions_relationship(cls, data):
        # Case A: Handling a live SQLAlchemy ORM instance
        if hasattr(data, "permissions") and data.permissions:
            # Safely serialize the core Role table columns into a standard dictionary
            data_dict = {c.key: getattr(data, c.key) for c in data.__table__.columns}
            
            # Map out BOTH names and UUIDs from the related Permission models
            data_dict["permissions"] = [p.slug for p in data.permissions] # or p.slug
            data_dict["permissions_id"] = [p.permission_id for p in data.permissions]
            return data_dict
            
        # Case B: Handling a raw dictionary fallback
        elif isinstance(data, dict):
            raw_perms = data.get("permissions", [])
            if raw_perms and not isinstance(raw_perms[0], (str, UUID)):
                data["permissions"] = [getattr(p, "name", p) for p in raw_perms]
                data["permissions_id"] = [getattr(p, "permission_id", p) for p in raw_perms]
                
        return data


# ─── NEW UPDATE SCHEMA ───
class RoleUpdate(BaseModel):
    role_name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    permission_ids: Optional[List[UUID]] = Field(None, description="The complete list of permission IDs for this role. Overwrites current links.")
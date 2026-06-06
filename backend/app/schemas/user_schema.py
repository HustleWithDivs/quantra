from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, model_validator

class UserRead(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    gender: str
    is_active: bool
    created_at: datetime
    created_by: Optional[UUID] = None
    modified_at: Optional[datetime] = None
    modified_by: Optional[UUID] = None
    roles: List[str] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_roles_to_name(cls, data):
        # When coming from SQLAlchemy, data is an ORM instance object
        if hasattr(data, "roles") and data.roles:
            # Safely extract the UUID from each Role instance model
            # dynamically transforming [RoleObj, RoleObj] -> [UUID, UUID]
            data_dict = {c.key: getattr(data, c.key) for c in data.__table__.columns}
            data_dict["roles"] = [role.role_name for role in data.roles]
            return data_dict
            
        # Fallback if data arrives as a normal dictionary
        elif isinstance(data, dict) and "roles" in data:
            # If the dict contains raw model objects inside the list
            if data["roles"] and not isinstance(data["roles"][0], (str, UUID)):
                data["roles"] = [getattr(r, "role_name", r) for r in data["roles"]]
       
        return data
class UserCreate(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Plain text password, will be hashed securely.")
    gender: str = Field(..., max_length=1, description="M / F / O")
    is_active: bool = True
    role_ids: List[UUID] = Field(default=[], description="Optional array of initial Role UUIDs to assign to this user.")

class UserResponseData(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    gender: str
    is_active: bool
    created_at: datetime
    # Used for display in your data grids/tables
    roles: List[str] = []
    # Used to populate select options / pre-filled forms in your UI
    roles_id: List[UUID] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_roles_to_names_and_ids(cls, data):
        # Case A: When coming from SQLAlchemy ORM object
        if hasattr(data, "roles") and data.roles:
            # Serialize the core User table columns into a standard dictionary
            data_dict = {c.key: getattr(data, c.key) for c in data.__table__.columns}
            
            # Populate BOTH arrays dynamically in a single loop execution
            data_dict["roles"] = [role.role_name for role in data.roles]
            data_dict["roles_id"] = [role.role_id for role in data.roles]
            return data_dict
            
        # Case B: Fallback if data arrives as a raw dictionary
        elif isinstance(data, dict):
            # Safe copies to ensure we don't mutate state unexpectedly
            raw_roles = data.get("roles", [])
            if raw_roles and not isinstance(raw_roles[0], (str, UUID)):
                data["roles"] = [getattr(r, "role_name", r) for r in raw_roles]
                data["roles_id"] = [getattr(r, "role_id", r) for r in raw_roles]
       
        return data

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    gender: Optional[str] = Field(None, max_length=1)
    is_active: Optional[bool] = None
    
    # Enforcing a single role constraint in the API contract
    role_id: Optional[UUID] = Field(None, description="The single Role UUID to assign to this user. Overwrites any existing role.")
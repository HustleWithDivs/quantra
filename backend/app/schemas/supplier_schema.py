from pydantic import BaseModel, EmailStr, ConfigDict,Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class SupplierRead(BaseModel):
    supplier_id: UUID
    supplier_code: str
    supplier_name: str

    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    country_id: Optional[int] = None
    gst_number: Optional[str] = None

    is_active: Optional[bool] = True
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# =========================
# CREATE
# =========================
class SupplierCreate(BaseModel):
    supplier_code: str = Field(..., max_length=200, description="Unique code ")
    supplier_name: str = Field(..., max_length=200, description="Unique name ")
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    country_id: Optional[int] = None
    gst_number: Optional[str] = None
    is_active: bool = True
    created_by: Optional[UUID] = None


# =========================
# UPDATE
# =========================
class SupplierUpdate(BaseModel):
    
    supplier_code: Optional[str] = Field(None, max_length=200)
    supplier_name: Optional[str] = Field(None, max_length=200)

    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    country_id: Optional[int] = None
    gst_number: Optional[str] = None

    is_active: Optional[bool] = None

    modified_by: Optional[UUID] = None


class SupplierResponseData(BaseModel):
    supplier_id: UUID
    supplier_code: str
    supplier_name: str

    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    country_id: Optional[int] = None
    gst_number: Optional[str] = None

    is_active: Optional[bool] = True
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

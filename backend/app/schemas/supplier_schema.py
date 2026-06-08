from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class SupplierBase(BaseModel):
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


# =========================
# CREATE
# =========================
class SupplierCreate(SupplierBase):
    created_by: Optional[UUID] = None


# =========================
# UPDATE
# =========================
class SupplierUpdate(BaseModel):
    supplier_code: Optional[str] = None
    supplier_name: Optional[str] = None

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


# =========================
# READ 
# =========================
class SupplierRead(SupplierBase):
    supplier_id: UUID
    created_at: datetime
    modified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
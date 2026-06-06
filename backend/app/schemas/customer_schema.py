from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# For Directory Listing (Lightweight)
class CustomerRead(BaseModel):
    customer_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    telephone: str
    city: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Granular Line Item Data
class OrderItemRead(BaseModel):
    product_id: UUID
    is_discounted: bool
    price: float
    quantity: int
    total: float

    model_config = ConfigDict(from_attributes=True)

# Main Invoice Summary
class CustomerOrderRead(BaseModel):
    order_id: UUID
    invoice_number: str
    cart_value: float
    total_amount: float
    discount: float
    status: Optional[int] = None
    created_at: datetime
    items: List[OrderItemRead] = [] # Line items tied to this specific invoice

    model_config = ConfigDict(from_attributes=True)

# Comprehensive Profile Summary
class CustomerDetailsRead(BaseModel):
    customer_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    telephone: str
    address: Optional[str] = None
    city: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    is_active: bool
    created_at: datetime
    
    orders: List[CustomerOrderRead] = [] # Complete historical ledger

    model_config = ConfigDict(from_attributes=True)
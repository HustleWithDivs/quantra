from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class CustomerReadSchema(BaseModel):
    customer_id: UUID
    first_name: str
    last_name: str
    email: Optional[str]
    telephone: Optional[str]
    address: Optional[str]  # Added to ensure all customer data maps correctly
    city: Optional[str]
    country: Optional[int]
    gender: Optional[str]
    date_of_birth: Optional[datetime]
    source: str
    source_customer_id: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class HistoryReadSchema(BaseModel):
    order_id: UUID
    product_id: Optional[UUID]
    is_discounted: bool
    price: float
    quantity: int
    total: float
    sales_price: float
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class OrderReadSchema(BaseModel):
    order_id: UUID
    invoice_number: str
    customer_id: UUID
    cart_value: float
    total_amount: float
    discount: float
    coupon_applied: Optional[str]
    status: str
    currency: str
    is_active: bool
    # Nesting the detailed order history records inside the order payload
    history_items: List[HistoryReadSchema] = [] 
    
    model_config = ConfigDict(from_attributes=True)
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ProductVariantBase(BaseModel):
    color_id: Optional[UUID] = None
    size_id: Optional[UUID] = None
    product_images: List[str] = Field(default_factory=list) # Holds local file paths (e.g., "/static/uploads/products/xyz.jpg")

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantUpdate(BaseModel):
    color_id: Optional[UUID] = None
    size_id: Optional[UUID] = None

class ProductVariantRead(ProductVariantBase):
    product_variant_id: UUID
    product_id: UUID
    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    sku: str = Field(..., max_length=100)
    upc_ean: Optional[str] = Field(None, max_length=100)
    product_name: str = Field(..., max_length=155)
    short_description: Optional[str] = Field(None, max_length=255)
    long_description: Optional[str] = Field(None, max_length=1000)
    business_category_id: UUID
    department_id: UUID
    category_id: UUID
    sub_category_id: UUID
    product_type_id: UUID
    brand_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    material_id: Optional[UUID] = None
    cost_price: float = Field(0.00, ge=0)
    selling_price: float = Field(0.00, ge=0)
    stock_qty: int = Field(0, ge=0)
    barcode: Optional[str] = Field(None, max_length=100)
    min_order_qty: int = Field(1, ge=1)
    weight: Optional[float] = Field(None, ge=0)
    dimensions: Optional[str] = Field(None, max_length=100)
    uom: Optional[str] = Field(None, max_length=50)
    is_active: bool = True
    is_taxable: bool = True
    is_perishable: bool = False
    expiry_date: Optional[datetime] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    sku: Optional[str] = Field(None, max_length=100)
    upc_ean: Optional[str] = Field(None, max_length=100)
    product_name: Optional[str] = Field(None, max_length=155)
    short_description: Optional[str] = Field(None, max_length=255)
    long_description: Optional[str] = Field(None, max_length=1000)
    business_category_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    sub_category_id: Optional[UUID] = None
    product_type_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    material_id: Optional[UUID] = None
    cost_price: Optional[float] = Field(None, ge=0)
    selling_price: Optional[float] = Field(None, ge=0)
    stock_qty: Optional[int] = Field(None, ge=0)
    barcode: Optional[str] = Field(None, max_length=100)
    min_order_qty: Optional[int] = Field(None, ge=1)
    weight: Optional[float] = Field(None, ge=0)
    dimensions: Optional[str] = Field(None, max_length=100)
    uom: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None
    is_taxable: Optional[bool] = None
    is_perishable: Optional[bool] = None
    expiry_date: Optional[datetime] = None


class ProductResponseData(ProductBase):
    product_id: UUID
    created_at: datetime
    modified_at: Optional[datetime] = None
    created_by: Optional[UUID] = None
    modified_by: Optional[UUID] = None
    variants: List[ProductVariantRead] = []
    model_config = ConfigDict(from_attributes=True)
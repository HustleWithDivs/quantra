import json
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ProductVariantBase(BaseModel):
    color_id: Optional[UUID] = None
    size_id: Optional[UUID] = None
    product_images: List[str] = Field(default_factory=list) # Holds local file paths

    color_name: Optional[str] = "Default Color"
    color_description: Optional[str] = ""
    size_name: Optional[str] = "Standard Size"
    size_description: Optional[str] = ""

    @model_validator(mode='before')
    @classmethod
    def populate_relational_details(cls, data):
        if isinstance(data, dict):
            return data
        
        # Safely extract preloaded relationship models
        color_obj = getattr(data, 'color', None)
        size_obj = getattr(data, 'size', None)
        
        # Construct a dictionary to feed into the Pydantic model fields
        resolved_data = {
            "color_id": getattr(data, "color_id", None),
            "size_id": getattr(data, "size_id", None),
            "product_images": getattr(data, "product_images", []),
            "color_name": color_obj.color_name if color_obj else "Default Color",
            "color_description": getattr(color_obj, "color_description", ""),
            "size_name": size_obj.size_name if size_obj else "Standard Size",
            "size_description": getattr(size_obj, "size_description", ""),
        }
        
        # Preserve primary/foreign keys when validating sub-classes like ProductVariantRead
        if hasattr(data, "product_variant_id"):
            resolved_data["product_variant_id"] = data.product_variant_id
        if hasattr(data, "product_id"):
            resolved_data["product_id"] = data.product_id
            
        return resolved_data

    @field_validator('product_images', mode='before')
    @classmethod
    def parse_json_images(cls, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return [value]
        return value or []
class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantUpdate(BaseModel):
    color_id: Optional[UUID] = None
    size_id: Optional[UUID] = None

class ProductVariantRead(ProductVariantBase):
    product_variant_id: UUID
    product_id: UUID
    
    # Block any implicit relational loop traversing up to the parent model
    model_config = ConfigDict(
        from_attributes=True,
        ignored_types=(object,) # Prevents cyclic property exploration loops
    )


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
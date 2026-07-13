import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, Numeric, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class Product(Base):
    """
    Core Product Entity Model mapping across the entire organizational taxonomy hierarchy.
    """
    __tablename__ = "product"

    product_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    sku = Column(String(100), unique=True, nullable=False)
    upc_ean = Column(String(100), nullable=True)
    product_name = Column(String(155), nullable=False)
    short_description = Column(String(255), nullable=True)
    long_description = Column(String(1000), nullable=True)
    
    # Structural Hierarchy Foreign Keys
    business_category_id = Column(UUID(as_uuid=True), ForeignKey("business_category.business_category_id"), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("department.department_id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("category.category_id"), nullable=False)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_category.sub_category_id"), nullable=False)
    product_type_id = Column(UUID(as_uuid=True), ForeignKey("product_type.product_type_id"), nullable=False)
    
    # Attribute Mapping Keys
    brand_id = Column(UUID(as_uuid=True), nullable=True)
    supplier_id = Column(UUID(as_uuid=True), nullable=True)
    material_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Pricing and Stock Attributes
    cost_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    selling_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    stock_qty = Column(Integer, default=0, nullable=False)
    barcode = Column(String(100), nullable=True)
    min_order_qty = Column(Integer, default=1, nullable=False)
    
    # Logistics and Metadata
    weight = Column(Numeric(10, 2), nullable=True)
    dimensions = Column(String(100), nullable=True) # e.g., "10x20x30 cm"
    uom = Column(String(50), nullable=True)          # Unit of Measurement
    is_active = Column(Boolean, default=True, nullable=False)
    is_taxable = Column(Boolean, default=True, nullable=False)
    is_perishable = Column(Boolean, default=False, nullable=False)
    expiry_date = Column(TIMESTAMP(timezone=True), nullable=True)
    
    # Audit Trackers
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # One-to-Many Relationship to Variants
    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan"
    )


class ProductVariant(Base):
    """
    ProductVariant Entity Model which cannot exist independently without its parent Product.
    """
    __tablename__ = "product_variant"

    product_variant_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("product.product_id", ondelete="CASCADE"), nullable=False)
    color_id = Column(UUID(as_uuid=True), ForeignKey("color.color_id", ondelete="SET NULL"), nullable=True)
    size_id = Column(UUID(as_uuid=True), ForeignKey("size.size_id", ondelete="SET NULL"), nullable=True)
    product_images = Column(JSON, default=list, nullable=True) # Array list of image URL strings

    # Relationship back to parent product
    product = relationship("Product", back_populates="variants")
    color = relationship("Color", foreign_keys=[color_id])
    size = relationship("Size", foreign_keys=[size_id])
    
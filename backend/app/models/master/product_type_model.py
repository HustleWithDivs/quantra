import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class ProductType(Base):
    __tablename__ = "product_type"

    product_type_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_category.sub_category_id"), nullable=True)
    product_type = Column(String(500), unique=True, nullable=False)
    product_type_description = Column(String(500), unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)

class Product_type_material(Base):
    __tablename__ = "product_type_material"

    material_id = Column(UUID(as_uuid=True), ForeignKey("material.material_id", ondelete="CASCADE"), primary_key=True)
    product_type_id = Column(UUID(as_uuid=True), ForeignKey("product_type.product_type_id"), primary_key=True)
     
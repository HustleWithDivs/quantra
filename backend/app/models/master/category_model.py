import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Category(Base):
    __tablename__ = "category"

    category_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_name = Column(String(500), unique=True, nullable=False)
    category_description = Column(String(500), unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)

class SubCategory(Base):
    __tablename__ = "sub_category"

    sub_category_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sub_category_name = Column(String(500), unique=True, nullable=False)
    sub_category_description = Column(String(500), unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True) 

class Category_sub_category(Base):
    __tablename__ = "category_sub_category"

    category_id = Column(UUID(as_uuid=True), ForeignKey("Category.category_id", ondelete="CASCADE"), primary_key=True)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("Sub_category.sub_category_id"), primary_key=True)
      

class subcategory_product_type(Base):
    __tablename__ = "subcategory_product_type"

    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("Sub_category.sub_category_id", ondelete="CASCADE"), primary_key=True)
    product_type_id = Column(UUID(as_uuid=True), ForeignKey("product_type.product_type_id"), primary_key=True)
           
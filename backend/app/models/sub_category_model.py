import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class CategorySubCategory(Base):
    __tablename__ = "category_sub_category"
    category_id = Column(UUID(as_uuid=True), ForeignKey("category.category_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_category.sub_category_id", ondelete="CASCADE"), primary_key=True, nullable=False)


class SubCategoryProductType(Base):
    __tablename__ = "subcategory_product_type"
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_category.sub_category_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    product_type_id = Column(UUID(as_uuid=True), ForeignKey("product_type.product_type_id", ondelete="CASCADE"), primary_key=True, nullable=False)


class SubCategory(Base):
    __tablename__ = "sub_category"

    sub_category_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    sub_category_name = Column(String(100), nullable=False)
    sub_category_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    categories = relationship(
        "Category",
        secondary="category_sub_category",
        back_populates="sub_categories"
    )

    # SUCCESS: SubCategoryProductType is now in scope!
    product_types = relationship(
        "ProductType",
        secondary="subcategory_product_type",  
        back_populates="sub_categories"
    )
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class CategorySubCategory(Base):
    """
    Explicit Association Model representing the Many-to-Many connectivity matrix
    between Categories and SubCategories following strict OOP architectural design.
    """
    __tablename__ = "category_sub_category"

    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("category.category_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )
    sub_category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("sub_category.sub_category_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )


class SubCategory(Base):
    """
    Core SubCategory Entity Model handling the lowest tier organizational 
    nodes mapped to multiple parent business category domains.
    """
    __tablename__ = "sub_category"

    sub_category_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    sub_category_name = Column(String(100), nullable=False)
    sub_category_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # Many-to-Many relationship pointing back up to categories
    categories = relationship(
        "Category",
        secondary="category_sub_category",
        back_populates="sub_categories"
    )
    # Add this inside your SubCategory model class:
    product_types = relationship(
        "ProductType",
        secondary="subcategory_product_type",
        back_populates="sub_categories"
    )
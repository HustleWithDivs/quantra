import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class SubCategoryProductType(Base):
    """
    Explicit Association Model representing the Many-to-Many connectivity matrix
    between SubCategories and ProductTypes following strict OOP guidelines.
    """
    __tablename__ = "subcategory_product_type"

    sub_category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("sub_category.sub_category_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )
    product_type_id = Column(
        UUID(as_uuid=True),
        ForeignKey("product_type.product_type_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )


class ProductType(Base):
    """
    Core ProductType Entity Model representing granular categorization nodes
    mapped across multiple subcategory parent structural buckets.
    """
    __tablename__ = "product_type"

    product_type_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    product_type = Column(String(100), nullable=False)
    product_type_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # Many-to-Many relationship mapping back up to SubCategories
    sub_categories = relationship(
        "SubCategory",
        secondary="subcategory_product_type",
        back_populates="product_types"
    )
# app/models/category_model.py
import uuid
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class DepartmentCategory(Base):
    __tablename__ = "department_category"

    department_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("department.department_id", ondelete="CASCADE"), 
        primary_key=True,
        nullable=False
    )
    category_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("category.category_id", ondelete="CASCADE"), 
        primary_key=True,
        nullable=False
    )


class Category(Base):
    """
    Core Category Entity Model representing organizational buckets that map
    to multiple structural operational units.
    """
    __tablename__ = "category"

    category_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    category_name = Column(String(100), nullable=False)
    category_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # Many-to-Many relationship mapping back to departments
    # The 'secondary' parameter accepts either the Table instance or its string table name
    departments = relationship(
        "Department",
        secondary="department_category",
        back_populates="categories"
    )
    sub_categories = relationship(
    "SubCategory",
    secondary="category_sub_category",
    back_populates="categories"
)
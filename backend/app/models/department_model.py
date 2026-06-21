# app/models/department_model.py
import uuid
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.business_category_model import BusinessCategory

class Department(Base):
    __tablename__ = "department"

    department_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    business_category_id = Column(UUID(as_uuid=True), ForeignKey("business_category.business_category_id"), nullable=False)
    department_name = Column(String(100), nullable=False)
    department_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # Relationships
    business_category = relationship("BusinessCategory", back_populates="departments")
    categories = relationship(
        "Category",
        secondary="department_category",
        back_populates="departments"
    )

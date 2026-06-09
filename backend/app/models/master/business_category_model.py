import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class BusinessCategory(Base):
    __tablename__ = "business_category"

    business_category_id  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_category_name = Column(String(100), nullable=False)
    business_category_description = Column(String(500), unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
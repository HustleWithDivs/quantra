from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

class Permission(Base):
    __tablename__ = "permissions"

    permission_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    slug = Column(String(100), primary_key=True, nullable=False) # Composite PK per your SQL dump
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
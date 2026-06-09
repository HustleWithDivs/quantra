import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Size(Base):
    __tablename__ = "size"

    size_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    size_name = Column(String(50), nullable=False, unique=True)
    size_description = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
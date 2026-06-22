import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Size(Base):
    __tablename__ = "size"

    size_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    size_name = Column(String(100), nullable=False)
    size_description = Column(String(500), unique=True, nullable=False)
    
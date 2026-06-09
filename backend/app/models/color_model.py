import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Color(Base):
    __tablename__ = "color"

    color_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    color_name = Column(String(100), nullable=False, unique=True)
    color_description = Column(String(255), nullable=True)

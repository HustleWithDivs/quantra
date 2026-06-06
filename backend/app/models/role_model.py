import uuid
from sqlalchemy import Column, BigInteger, String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base # Assuming your declarative base is here
from sqlalchemy.dialects.postgresql import UUID

class RolePermission(Base):
    __tablename__ = "role_permissions"
    
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.role_id", ondelete="CASCADE"), primary_key=True)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.permission_id"), primary_key=True)

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    role_name = Column(String(200), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)

    # Relationship to track permissions through the junction table
    permissions = relationship("Permission", secondary="role_permissions", backref="roles")
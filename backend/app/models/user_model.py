import uuid
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# Junction table model matching your user_roles schema
class UserRole(Base):
    __tablename__ = "user_roles"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.role_id", ondelete="CASCADE"), primary_key=True)


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(500), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    gender = Column(String(1), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    # Many-to-many relationship tracking assigned roles
    roles = relationship("Role", secondary="user_roles", backref="users")
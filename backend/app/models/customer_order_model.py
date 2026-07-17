import uuid
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    telephone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    date_of_birth = Column(TIMESTAMP(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    source = Column(String(100), primary_key=True, nullable=False)  # Part of composite unique key
    source_customer_id = Column(String(100), primary_key=True, nullable=False)  # Part of composite unique key
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number = Column(String(100), unique=True, nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.customer_id"), nullable=False)
    cart_value = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), default=0.00)
    discount = Column(Numeric(10, 2), default=0.00)
    coupon_applied = Column(String(100), nullable=True)
    status = Column(String(50), default="Pending")
    is_active = Column(Boolean, default=True, nullable=False)
    currency = Column(String(10), default="USD")
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    history_items = relationship("CustomerOrderHistory", backref="order", cascade="all, delete-orphan")

class CustomerOrderHistory(Base):
    __tablename__ = "customer_order_history"

    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.order_id"), primary_key=True)
    product_id = Column(UUID(as_uuid=True), nullable=True)
    is_discounted = Column(Boolean, default=False)
    price = Column(Numeric(10, 2), default=0.00)
    quantity = Column(Integer, default=1)
    total = Column(Numeric(10, 2), default=0.00)
    sales_price= Column(Numeric(10, 2), default=0.00)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
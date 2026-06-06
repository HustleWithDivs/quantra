import uuid
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(500), unique=True, nullable=False)
    telephone = Column(String(15), nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(500), nullable=True)
    country = Column(BigInteger, nullable=True) # Matches your schema type
    gender = Column(String(1), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    
    # Keeping your exact schema types for these two inverted fields:
    modified_by = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_at = Column(BigInteger, nullable=True)

    # Relationships
    orders = relationship("Order", back_populates="customer", order_by="Order.created_at.desc()")


class Order(Base):
    __tablename__ = "order" # Matches your double-quoted "order" table name

    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number = Column(String(50), nullable=False, unique=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.customer_id"))
    cart_value = Column(Numeric(12, 2), default=0.00)
    total_amount = Column(Numeric(12, 2), default=0.00)
    discount = Column(Numeric(12, 2), default=0.00)
    coupon_applied = Column(Numeric(12, 2), default=0.00)
    status = Column(BigInteger, nullable=True)
    currency = Column(BigInteger, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), nullable=True)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("CustomerOrderHistory", back_populates="order")


class CustomerOrderHistory(Base):
    __tablename__ = "customer_order_history"

    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"), primary_key=True)
    product_id = Column(UUID(as_uuid=True), primary_key=True) # Assuming compound key or line items
    is_discounted = Column(Boolean, default=False)
    price = Column(Numeric(12, 2), default=0.00)
    quantity = Column(BigInteger, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    total = Column(Numeric(12, 2), default=0.00)

    order = relationship("Order", back_populates="items")
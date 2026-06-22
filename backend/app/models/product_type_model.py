import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
# Import it from sub_category_model to use its table construct cleanly
from app.models.sub_category_model import SubCategoryProductType

class ProductType(Base):
    __tablename__ = "product_type"

    product_type_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    product_type = Column(String(100), nullable=False)
    product_type_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    modified_by = Column(UUID(as_uuid=True), nullable=True)

    sub_categories = relationship(
        "SubCategory",
        secondary="subcategory_product_type",
        back_populates="product_types"
    )
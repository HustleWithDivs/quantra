import uuid
from datetime import datetime
from sqlalchemy import Column, String, JSON, TIMESTAMP, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class IngestionTemplate(Base):
    """
    Stores user-configured column map schemas matching supplier spreadsheet 
    headers directly to rigid internal database product properties.
    """
    __tablename__ = "ingestion_template"

    template_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    template_name = Column(String(155), unique=True, nullable=False) # e.g., "Nike Supplier Feed v2"
    
    # JSON Matrix mapping file headers to DB keys: 
    # e.g., {"Vendor SKU": "sku", "Item Name": "product_name", "Cost Price": "cost_price"}
    column_mapping = Column(JSON, nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    modified_at = Column(TIMESTAMP(timezone=True), nullable=True)
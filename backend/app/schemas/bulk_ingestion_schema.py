from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

class AnalyzeFileResponseData(BaseModel):
    headers: List[str]
    suggested_mapping: Dict[str, str]
    mapping_exists: bool
    template_id: Optional[UUID] = None
    match_percentage: float
    preview_rows: List[Dict[str, Any]]

class SaveMappingTemplateRequest(BaseModel):
    template_name: str
    column_mapping: Dict[str, str]

class SaveMappingTemplateResponse(BaseModel):
    template_id: UUID
    template_name: str
    message: str
class ExecuteBulkUploadResponse(BaseModel):
    requestStatus: bool
    message: str

class IngestionTemplateResponse(BaseModel):
    template_id: UUID
    template_name: str
    column_mapping: Dict[str, str]
    is_active: bool
    created_at: datetime
    modified_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ToggleTemplateResponse(BaseModel):
    success: bool
    message: str

# Specific schema for handling incoming update payloads
class UpdateMappingPayload(BaseModel):
    template_name: str
    column_mapping: Dict[str, str]

# Specific schema for returning the template record data itself
class IngestionTemplateSchema(BaseModel):
    template_id: str
    template_name: str
    column_mapping: Dict[str, str]
    is_active: bool

    class Config:
        from_attributes = True
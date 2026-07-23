from datetime import datetime
from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field

class ForecastGenerationRequest(BaseModel):
    level: Literal["overall", "brand", "category", "subcategory", "product"]
    selection_uuid: Optional[UUID] = Field(default=None, description="Target component UUID lookup identifier")
    days_to_predict: int = Field(default=15, ge=1, le=180)

class ForecastDayPayload(BaseModel):
    # CHANGED: Switch from str to datetime to parse the SQLAlchemy DateTime field
    forecast_date: datetime
    predicted_quantity: float

    class Config:
        from_attributes = True

class ForecastRunResponse(BaseModel):
    id: int
    created_at: datetime
    level: str
    selection_uuid: Optional[UUID]
    model_version: str
    days_forecasted: int
    values: List[ForecastDayPayload]

    class Config:
        from_attributes = True
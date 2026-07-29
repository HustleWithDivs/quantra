from datetime import datetime
from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ForecastGenerationRequest(BaseModel):
    level: Literal["overall", "brand", "category", "subcategory", "product"] = "overall"
    selection_uuid: Optional[UUID] = Field(default=None, description="Target component UUID lookup identifier")
    days_to_predict: int = Field(default=90, ge=1, le=180)


class ChartPoint(BaseModel):
    date_label: str  # e.g., "Jan 25"
    actual_quantity: Optional[float] = None
    forecast_quantity: Optional[float] = None
    is_forecast: bool = False


class ForecastMetrics(BaseModel):
    predicted_peak_month: str          # e.g., "March 2025"
    predicted_peak_growth: str         # e.g., "+28% vs current"
    avg_monthly_growth: str            # e.g., "5.2%"
    confidence_interval: str           # e.g., "±4.8%"
    seasonality_factor: str            # e.g., "1.12x"


class ForecastRunResponseData(BaseModel):
    id: int
    created_at: datetime
    level: str
    selection_uuid: Optional[UUID] = None
    model_version: str
    days_forecasted: int
    metrics: ForecastMetrics
    chart_points: List[ChartPoint]

    class Config:
        from_attributes = True
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field
  

class SimulationRequest(BaseModel):
    level: Literal["overall", "brand", "category", "subcategory", "product"] = Field(
        default="overall", 
        description="Aggregation target level"
    )
    selection_uuid: Optional[UUID] = Field(
        default=None, 
        description="UUID lookup identifier (optional when level is 'overall')"
    )
    shipping_delay_days: int = Field(default=0, ge=0, le=14, description="Additional shipping delay in days")
    competitor_price_change_pct: float = Field(default=0.0, ge=-20.0, le=20.0, description="Percentage change in competitor pricing")
    demand_multiplier: float = Field(default=1.0, ge=0.5, le=2.0, description="Overall market demand multiplier")
    projection_days: int = Field(default=90, ge=1, le=180, description="Simulation window in days")


class SimulationResponseData(BaseModel):
    level: str
    selection_uuid: Optional[UUID]
    projected_profit_risk: float
    revenue_impact: float
    stockout_risk_percentage: float
    customer_satisfaction_index: float
    scenario_summary: str


from typing import List, Optional
from pydantic import BaseModel


class DashboardMetricCard(BaseModel):
    title: str
    value: str
    subtext: str


class DashboardChartPoint(BaseModel):
    date_label: str
    actual_quantity: Optional[float] = None
    forecast_quantity: Optional[float] = None
    is_forecast: bool = False


class DashboardOverviewResponse(BaseModel):
    predicted_peak_month: DashboardMetricCard
    avg_monthly_growth: DashboardMetricCard
    confidence_interval: DashboardMetricCard
    seasonality_factor: DashboardMetricCard
    total_revenue_30d: float
    total_units_sold_30d: int
    active_products_count: int
    chart_data: List[DashboardChartPoint] = []
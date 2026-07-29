from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.response_schema import APIResponse
from app.schemas.dashboard_schema import DashboardOverviewResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=APIResponse[DashboardOverviewResponse])
def get_dashboard_overview(db: Session = Depends(get_db)):
    metrics = DashboardService.get_dashboard_metrics(db)
    return APIResponse(
        code=status.HTTP_200_OK,
        requestStatus=True,
        message="Dashboard metrics fetched successfully",
        data=metrics
    )
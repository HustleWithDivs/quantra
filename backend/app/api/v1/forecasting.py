import logging
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.schemas.response_schema import APIResponse
from app.schemas.forecasting_schema import ForecastGenerationRequest, ForecastRunResponseData
from app.services.forecasting_service import ForecastingService
from app.core.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/demand-forecasting", tags=["Demand Forecasting"])


@router.post("/forecasts/generate", response_model=APIResponse[ForecastRunResponseData], status_code=status.HTTP_201_CREATED)
def generate_new_forecast(payload: ForecastGenerationRequest, db: Session = Depends(get_db)):
    try:
        new_run = ForecastingService.generate_and_save_forecast(db, payload)
        formatted_data = ForecastingService.format_forecast_response(db, new_run)

        return APIResponse(
            code=status.HTTP_201_CREATED,
            requestStatus=True,
            message="Forecast generated successfully",
            data=formatted_data,
        )
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(val_err))
    except Exception as e:
        logger.error(f"Forecast generation failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Runtime engine break: {str(e)}")


@router.get("/forecasts/latest", response_model=APIResponse[ForecastRunResponseData])
def get_latest_saved_forecast(
    level: str = Query("overall", description="overall, brand, category, subcategory, or product"),
    selection_uuid: Optional[UUID] = Query(None, description="Criteria selection UUID identifier"),
    db: Session = Depends(get_db),
):
    saved_run = ForecastingService.get_latest_forecast(db, level, selection_uuid)
    if not saved_run:
        # Fallback generate if none exists yet
        try:
            req = ForecastGenerationRequest(level=level, selection_uuid=selection_uuid, days_to_predict=90)
            saved_run = ForecastingService.generate_and_save_forecast(db, req)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No historic forecast run records located: {str(e)}",
            )

    formatted_data = ForecastingService.format_forecast_response(db, saved_run)

    return APIResponse(
        code=status.HTTP_200_OK,
        requestStatus=True,
        message="Latest forecast fetched successfully",
        data=formatted_data,
    )
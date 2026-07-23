# app/api/v1/forecasting.py
import logging
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.schemas.response_schema import APIResponse
from app.schemas.forecasting_schema import ForecastGenerationRequest, ForecastRunResponse
from app.services.forecasting_service import ForecastingService
from app.core.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/demand-forecasting", tags=["Demand Forecasting"])

@router.post("/forecasts/generate", response_model=APIResponse[ForecastRunResponse], status_code=status.HTTP_201_CREATED)
def generate_new_forecast(payload: ForecastGenerationRequest, db: Session = Depends(get_db)):
    try:
        new_run = ForecastingService.generate_and_save_forecast(db, payload)
        
        # CORRECTED: Added explicit envelope fields required by APIResponse schema
        return APIResponse(
            code=status.HTTP_201_CREATED,
            requestStatus=True,
            message="Forecast generated successfully",
            data=new_run
        )
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Runtime engine break: {str(e)}")

@router.get("/forecasts/latest", response_model=APIResponse[ForecastRunResponse])
def get_latest_saved_forecast(
    level: str = Query(..., description="overall, business_category, department, category, subcategory, or product"),
    selection_uuid: Optional[UUID] = Query(None, description="The corresponding criteria parameter UUID string"),
    db: Session = Depends(get_db)
):
    saved_run = ForecastingService.get_latest_forecast(db, level, selection_uuid)
    if not saved_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"No historic forecast run records located matching current selections."
        )
        
    # CORRECTED: Added explicit envelope fields required by APIResponse schema
    return APIResponse(
        code=status.HTTP_200_OK,
        requestStatus=True,
        message="Latest forecast fetched successfully",
        data=saved_run
    )
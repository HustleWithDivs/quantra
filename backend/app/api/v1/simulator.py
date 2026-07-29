import logging
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.response_schema import APIResponse
from app.schemas.simulator_schema import SimulationRequest, SimulationResponseData
from app.services.simulator_service import SimulatorService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/what-if-simulator", tags=["What-If Simulator"])


@router.post("/run", response_model=APIResponse[SimulationResponseData], status_code=status.HTTP_200_OK)
def execute_what_if_simulation(payload: SimulationRequest, db: Session = Depends(get_db)):
    try:
        simulation_data = SimulatorService.run_simulation(db, payload)
        
        return APIResponse(
            code=status.HTTP_200_OK,
            requestStatus=True,
            message="Simulation executed successfully",
            data=simulation_data
        )
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        logger.error(f"Simulator engine failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation processing error: {str(e)}"
        )
import json
import logging
from typing import List, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from app.core.database import get_db, engine
from app.core.dependency import get_current_user
from app.models.user_model import User
from app.models.customer_order_model import Customer, Order
from app.schemas.response_schema import APIResponse,PaginatedResponse
from app.schemas.customer_order_schema import CustomerReadSchema, OrderReadSchema
from app.services.customer_order_service import CustomerOrderIngestionEngine

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sales-data", tags=["Sales Bulk Ingestion Engine"])

# =========================================================================
# 1. BULK INGESTION/UPSERT DATA SOURCE PIPELINE
# =========================================================================
@router.post(
    "/bulk-upsert",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=APIResponse[None]
)
async def bulk_upsert_sales_records(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    column_mapping_json: str = Form(..., description="JSON layout dictionary string mapping headers"),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts flat row catalog CSV datasets to safely parse, match keys, and upsert records inside the background thread block.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid extension channel format. Endpoint processes CSV streams only.")

    try:
        column_mapping = json.loads(column_mapping_json)
        if not isinstance(column_mapping, dict):
            raise ValueError()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid layout schema structure dictionary serialization data payload string.")

    file_bytes = await file.read()

    def db_session_factory():
        return Session(bind=engine)

    background_tasks.add_task(
        CustomerOrderIngestionEngine.process_csv_async,
        db_session_factory=db_session_factory,
        file_bytes=file_bytes,
        column_map=column_mapping,
        current_user_id=current_user.user_id
    )

    return APIResponse.success(
        code=202,
        message="Bulk catalog schema received! Log streaming initialized within backend workspace file handlers.",
        data=None
    )

# =========================================================================
# 1. FETCH ALL CUSTOMER RECORDS
# =========================================================================
@router.get(
    "/customers", 
    response_model=APIResponse[PaginatedResponse[CustomerReadSchema]],
    status_code=status.HTTP_200_OK
)
def get_all_customers(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """
    Retrieves complete structural records for all clients registered inside the system, 
    including internal UUID strings and external mapping composite references.
    """
    query = db.query(Customer)
    total_count=query.count()
    customers=query.offset(offset).limit(limit).all()
    
    # Standard validation dump parsing across active schemas
    customer_data = [CustomerReadSchema.model_validate(c) for c in customers]
    paginated_data = {
            "items": customer_data,
            "total": total_count,
            "limit": limit,
            "offset": offset
        }
    return APIResponse.success(
        code=200,
        message="Customer records successfully fetched.",
        data=paginated_data
    )

# =========================================================================
# 2. FETCH ORDERS PER CUSTOMER ID WITH NESTED HISTORY
# =========================================================================
@router.get(
    "/orders/customer/{customer_id}", 
    response_model=APIResponse[List[OrderReadSchema]],
    status_code=status.HTTP_200_OK
)
def get_orders_by_customer_id(customer_id: UUID, db: Session = Depends(get_db)):
    """
    Fetches all transactional orders tracked under a given customer ID string, 
    automatically bundling nested line-item transaction history items into the JSON array data stream.
    """
    # Check if the targeted customer actually exists inside the database first
    customer_exists = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Target client identifier '{customer_id}' was not found in active master profiles."
        )

    # Fetch orders and execute an optimized Eager Load on related history rows
    orders = (
        db.query(Order)
        .options(joinedload(Order.history_items))
        .filter(Order.customer_id == customer_id)
        .all()
    )

    # Process models securely using configured dict formatting schemas
    data = [OrderReadSchema.model_validate(o) for o in orders]

    return APIResponse.success(
        code=200,
        message=f"Retrieved {len(orders)} invoice orders with detailed product history items for this customer.",
        data=data
    )
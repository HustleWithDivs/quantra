import csv
import io
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db, sessionmaker # sessionmaker factory passed down to background context workers
from app.schemas.response_schema import APIResponse
from app.services.ai_mapping_service import generate_ai_mapping_suggestions
from app.services.bulk_ingestion_service import BulkIngestionEngine

router = APIRouter(prefix="/ingestion", tags=["Catalog Ingestion Core"])

@router.post("/analyze-file", response_model=APIResponse[dict])
async def analyze_uploaded_file_headers(file: UploadFile = File(...)):
    """
    Parses the top rows of an unknown file format to analyze columns and 
    returns an AI-suggested database configuration mapping framework matrix.
    """
    contents = await file.read(2048) # Read starting chunk buffer stream bytes safely
    file_stream = io.StringIO(contents.decode("utf-8"))
    reader = csv.reader(file_stream)
    headers = next(reader, [])
    
    if not headers:
        raise HTTPException(status_code=400, detail="The file provided lacks verifiable layout text headers.")

    ai_suggestions = generate_ai_mapping_suggestions(headers)
    
    return APIResponse.success(
        code=200, 
        message="AI recommendations for your file configuration compiled cleanly.", 
        data={"headers": headers, "suggested_mapping": ai_suggestions}
    )

@router.post("/execute-bulk-upload")
async def execute_bulk_upload(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    column_mapping_json: str = Form(...), # Serialized JSON map string payload from user adjustments UI
    db: Session = Depends(get_db)
):
    """
    Accepts full catalog file loads and fires off scalable thread execution routines.
    """
    import json
    parsed_mapping = json.loads(column_mapping_json)
    
    # Read entire dataset array context rows memory frames
    file_bytes = await file.read()
    file_stream = io.StringIO(file_bytes.decode("utf-8"))
    reader = csv.DictReader(file_stream)
    rows_list = list(reader)

    if not rows_list:
        raise HTTPException(status_code=400, detail="The uploaded file contains zero active data rows.")

    # Delegate loop iteration processes onto external background executors cleanly
    from app.core.database import SessionLocal # Import specific runtime thread local bind
    background_tasks.add_task(
        # Pass standalone database initialization contexts into thread contexts safely
        BulkIngestionEngine.process_csv_rows_task, 
        SessionLocal, 
        rows_list, 
        parsed_mapping
    )

    return APIResponse.success(
        code=202, 
        message=f"Ingestion process successfully initialized. Ingesting {len(rows_list)} entries in the background.", 
        data={"queued_records_count": len(rows_list)}
    )
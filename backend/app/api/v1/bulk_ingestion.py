import csv
import io
import json
import logging
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db, engine
from app.models.ingestion_template import IngestionTemplate
from app.services.bulk_ingestion_service import SmartMdmEngine
from app.services.ai_mapping_service import generate_ai_mapping_suggestions
from app.schemas.bulk_ingestion_schema import AnalyzeFileResponseData, SaveMappingTemplateRequest, IngestionTemplateSchema, SaveMappingTemplateResponse, ExecuteBulkUploadResponse, IngestionTemplateResponse, ToggleTemplateResponse, UpdateMappingPayload
from typing import Any, Dict, List, Optional, Tuple
from app.schemas.response_schema import APIResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ingestion", tags=["Smart MDM Bulk Ingestion"])

@router.post("/analyze-file", response_model=AnalyzeFileResponseData)
async def analyze_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid extension channel. This workspace endpoint accepts CSV files only.")

    contents = await file.read()
    decoded = contents.decode("utf-8")
    f = io.StringIO(decoded)
    reader = csv.reader(f)
    
    headers = next(reader, None)
    if not headers:
        raise HTTPException(status_code=400, detail="Empty matrix layer tracked. File does not contain headers.")

    f.seek(0)
    dict_reader = csv.DictReader(f)
    preview_rows = []
    for _ in range(5):
        row = next(dict_reader, None)
        if row:
            preview_rows.append(row)
        else:
            break

    matched_template, score = SmartMdmEngine.find_matching_template(db, headers)
    
    if matched_template:
        suggested_mapping = matched_template.column_mapping
        mapping_exists = True
        template_id = matched_template.template_id
    else:
        suggested_mapping = generate_ai_mapping_suggestions(headers)
        mapping_exists = False
        template_id = None

    return {
        "headers": headers,
        "suggested_mapping": suggested_mapping,
        "mapping_exists": mapping_exists,
        "template_id": template_id,
        "match_percentage": round(score, 2),
        "preview_rows": preview_rows
    }

@router.post("/save-template", response_model=SaveMappingTemplateResponse)
async def save_template(payload: SaveMappingTemplateRequest, db: Session = Depends(get_db)):
    existing = db.query(IngestionTemplate).filter(IngestionTemplate.template_name == payload.template_name).first()
    if existing:
        existing.column_mapping = payload.column_mapping
        db.commit()
        db.refresh(existing)
        return {"template_id": existing.template_id, "template_name": existing.template_name, "message": "Updated existing template successfully."}

    new_tmpl = IngestionTemplate(template_name=payload.template_name, column_mapping=payload.column_mapping)
    db.add(new_tmpl)
    db.commit()
    db.refresh(new_tmpl)
    return {"template_id": new_tmpl.template_id, "template_name": new_tmpl.template_name, "message": "New template profile saved successfully."}

@router.post(
    "/execute-bulk-upload", 
    response_model=ExecuteBulkUploadResponse,
    status_code=status.HTTP_202_ACCEPTED
)
async def execute_bulk_upload(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    column_mapping_json: Any = Form(...),
):
    column_mapping = None
    try:
        if isinstance(column_mapping_json, str):
            clean_str = column_mapping_json.strip()
            while isinstance(clean_str, str) and (clean_str.startswith('"') and clean_str.endswith('"') or clean_str.startswith('{')):
                try:
                    parsed = json.loads(clean_str)
                    if isinstance(parsed, dict):
                        column_mapping = parsed
                        break
                    clean_str = parsed
                except json.JSONDecodeError:
                    break
            
            if not column_mapping and isinstance(clean_str, str):
                column_mapping = json.loads(clean_str)
        else:
            column_mapping = column_mapping_json

        if not isinstance(column_mapping, dict):
            raise ValueError()
            
    except Exception as parse_err:
        logger.error(f"Mapping structural parsing failed. Raw input: {column_mapping_json}. Error: {str(parse_err)}")
        raise HTTPException(status_code=400, detail="Invalid layout schema dictionary serialization string.")

    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file stream: {str(e)}")

    def db_session_factory():
        return Session(bind=engine)

    background_tasks.add_task(
        SmartMdmEngine.process_bytes_in_background,
        db_session_factory=db_session_factory,
        file_bytes=file_bytes,
        column_map=column_mapping
    )

    return ExecuteBulkUploadResponse(
        code=status.HTTP_202_ACCEPTED,
        requestStatus=True,
        message="Your file data has been safely received! Processing logs are streaming to /app/logs/bulk_ingestion.log",
        data=None
    )

@router.get("/templates", response_model=List[IngestionTemplateResponse])
def get_all_templates(db: Session = Depends(get_db)):
    return db.query(IngestionTemplate).order_by(IngestionTemplate.created_at.desc()).all()

# --- 1. GET TEMPLATE BY ID ---
@router.get("/templates/{template_id}", response_model=APIResponse[IngestionTemplateSchema])
def get_template_by_id(template_id: str, db: Session = Depends(get_db)):
    template = db.query(IngestionTemplate).filter(IngestionTemplate.template_id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template mapping matrix config not found.")
    
    validated_data = IngestionTemplateSchema.model_validate(template)
    return APIResponse(
        code=200,
        requestStatus=True,
        message="Template layout configuration fetched successfully.",
        data=validated_data
    )

# --- 2. PUT (UPDATE) TEMPLATE ---
@router.put("/templates/{template_id}", response_model=APIResponse[IngestionTemplateSchema])
def update_template_mapping(template_id: str, payload: UpdateMappingPayload, db: Session = Depends(get_db)):
    template = db.query(IngestionTemplate).filter(IngestionTemplate.template_id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template mapping matrix config not found.")

    template.template_name = payload.template_name
    template.column_mapping = payload.column_mapping
    
    db.commit()
    db.refresh(template)

    validated_data = IngestionTemplateSchema.model_validate(template)
    return APIResponse(
        code=200,
        requestStatus=True,
        message=f"Ingestion layout matrix changes for '{template.template_name}' updated successfully.",
        data=validated_data
    )

# --- 3. DELETE TEMPLATE ---
@router.delete("/templates/{template_id}", response_model=APIResponse[None])
def delete_template_mapping(template_id: str, db: Session = Depends(get_db)):
    template = db.query(IngestionTemplate).filter(IngestionTemplate.template_id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template mapping matrix config not found.")
    
    try:
        db.delete(template)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return APIResponse(
        code=200,
        requestStatus=True,
        message=f"Template layout configuration '{template.template_name}' has been deleted successfully.",
        data=None 
    )
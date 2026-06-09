from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.master_config import MASTER_CONFIG
from app.schemas.response_schema import APIResponse

def create_master_router(entity_name: str):

    router = APIRouter()
    crud = MASTER_CONFIG[entity_name]

    model = crud.model
    id_field = crud.id_field
    search_fields = crud.search_fields

    @router.post(f"/{entity_name}")
    def create_item(payload: dict, db: Session = Depends(get_db)):
        return crud.create(db, payload)

    @router.get(f"/{entity_name}/{{item_id}}")
    def get_item(item_id: str, db: Session = Depends(get_db)):
        return crud.get(db, item_id)

    @router.get(f"/{entity_name}")
    def list_items(db: Session = Depends(get_db)):
        result = crud.get_all(db)
        return APIResponse.success(message=f"{entity_name.capitalize()} records fetched successfully", data=result)


    @router.put(f"/{entity_name}/{{item_id}}")
    def update_item(item_id: str, payload: dict, db: Session = Depends(get_db)):
        return crud.update(db, item_id, payload)

    @router.delete(f"/{entity_name}/{{item_id}}")
    def delete_item(item_id: str, db: Session = Depends(get_db)):
        return crud.delete(db, item_id)

    return router
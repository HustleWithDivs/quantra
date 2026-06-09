from app.models.color_model import Color
# from app.models.size import Size
from app.core.master_crud import MasterCRUD

MASTER_CONFIG = {
    "color": MasterCRUD(
        model=Color,
        id_field="color_id",
        search_fields=["color_name"]
    ),
    # "size": MasterCRUD(
    #     model=Size,
    #     id_field="size_id",
    #     search_fields=["size_name"]
    # )
}
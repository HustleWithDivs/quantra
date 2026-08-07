from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.brand_service import BrandService
from app.schemas.response_schema import APIResponse, PaginatedResponse
from app.schemas.brand_schema import BrandRead, BrandCreate,BrandUpdate,BrandResponseData
from app.core.dependency import PermissionChecker, get_current_user
from app.models.user_model import User


router = APIRouter(prefix="/brand", tags=["Brands"])
@router.get("", 
response_model=APIResponse[PaginatedResponse[BrandRead]],
status_code=status.HTTP_200_OK
)
def list_brand(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("brand:view_brand"))
):
    """Get global directory list of all registered customers."""
    try:
        brand_db, total_count = BrandService.get_all_brand(
            db=db, 
            limit=limit, 
            offset=offset,
            is_active=is_active, 
            search=search
        )
        brand_data = [BrandRead.model_validate(brand) for brand in brand_db]
        
        paginated_data = {
            "items": brand_data,
            "total": total_count,
            "limit": limit,
            "offset": offset
        }
        
        return APIResponse.success(data=paginated_data)
        

    except Exception as e:
        return APIResponse.fail(message=str(e))

@router.get(
    "/{brand_id}", 
    response_model=APIResponse[BrandResponseData],
    status_code=status.HTTP_200_OK
)
def get_brand_details(
    brand_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("brand:view_brand"))
):
    """
    Retrieve comprehensive business category details for a specific brand id.
    """
    brand_db = BrandService.get_brand_by_id(db=db, brand_id=brand_id)
    return APIResponse.success(
        code=200,
        message="Brand retrieved successfully",
        data=BrandResponseData.model_validate(brand_db)
    )

@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse[BrandRead])
def create_brand(
    payload: BrandCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("brand:create_brand"))
):
    
    current_user_id = current_user.user_id # Integrated with Auth later
    brand = BrandService.create_brand(
        db=db,
        payload=payload,
        current_user_id=current_user
    )

    response_data = BrandRead.model_validate(brand)

    return APIResponse.success(
        code=201,
        message="Brand created successfully",
        data=response_data
    )

@router.put(
    "/{brand_id}",
    response_model=APIResponse[BrandRead],
    status_code=status.HTTP_200_OK
)
def update_brand(
    brand_id: UUID,
    brand_in: BrandUpdate,
    db: Session = Depends(get_db),
    current_user: UUID = Depends(lambda: None)  # replace with JWT user later
):
    """
    Update an existing brand.
    """

    updated_brand = BrandService.update_brand(
        db=db,
        brand_id=brand_id,
        brand_in=brand_in,
        current_user_id=current_user
    )

    response_data = BrandRead.model_validate(updated_brand)

    return APIResponse.success(
        code=200,
        message="Brand synchronized successfully",
        data=response_data
    )  

      

@router.delete("/{brand_id}", response_model=APIResponse[dict])
def delete_brand(
    brand_id: UUID,
    db: Session = Depends(get_db),
):
    BrandService.delete_brand(db=db, brand_id=brand_id)

    return APIResponse.success(
        code=200,
        message="Brand deleted successfully",
        data={}
    )
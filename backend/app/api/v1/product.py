import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.response_schema import APIResponse
from app.schemas.product_schema import ProductCreate, ProductResponseData, ProductUpdate, ProductVariantRead, ProductVariantUpdate
from app.services.product_service import ProductService
from app.core.database import get_db
from app.core.dependency import PermissionChecker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Product Portfolio Management"])


# =========================================================================
# 📦 PRODUCT RESOURCE ROUTING SUITE
# =========================================================================

@router.get("", response_model=APIResponse[List[ProductResponseData]])
def list_all_products(
    limit: int = Query(default=100, ge=1, le=100), offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None), search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:view_product"))
):
    products_db = ProductService.get_all_products(db=db, limit=limit, offset=offset, is_active=is_active, search=search)
    return APIResponse.success(code=200, message="Catalog portfolio listings compiled cleanly", data=products_db)


@router.get("/{product_id}", response_model=APIResponse[ProductResponseData])
def get_product_by_id(
    product_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:view_product"))
):
    product_db = ProductService.get_product_by_id(db=db, product_id=product_id)
    return APIResponse.success(code=200, message="Target product structure layout pulled", data=product_db)


@router.post("", response_model=APIResponse[ProductResponseData], status_code=status.HTTP_201_CREATED)
def create_product_with_initial_variant(
    # Unpack product create fields as standard parameters dynamically
    sku: str = Form(...), product_name: str = Form(...),
    business_category_id: UUID = Form(...), department_id: UUID = Form(...),
    category_id: UUID = Form(...), sub_category_id: UUID = Form(...), product_type_id: UUID = Form(...),
    upc_ean: Optional[str] = Form(None), short_description: Optional[str] = Form(None), long_description: Optional[str] = Form(None),
    brand_id: Optional[UUID] = Form(None), supplier_id: Optional[UUID] = Form(None), material_id: Optional[UUID] = Form(None),
    cost_price: float = Form(0.00), selling_price: float = Form(0.00), stock_qty: int = Form(0),
    barcode: Optional[str] = Form(None), min_order_qty: int = Form(1), weight: Optional[float] = Form(None),
    dimensions: Optional[str] = Form(None), uom: Optional[str] = Form(None), is_active: bool = Form(True),
    is_taxable: bool = Form(True), is_perishable: bool = Form(False),
    
    # Unpack nested mandatory initial variant arguments here 
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: List[UploadFile] = File(default_factory=list),
    
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:create_product"))
):
    # Construct schema object context mapping internally
    product_in = ProductCreate(
        sku=sku, product_name=product_name, business_category_id=business_category_id, department_id=department_id,
        category_id=category_id, sub_category_id=sub_category_id, product_type_id=product_type_id, upc_ean=upc_ean,
        short_description=short_description, long_description=long_description, brand_id=brand_id, supplier_id=supplier_id,
        material_id=material_id, cost_price=cost_price, selling_price=selling_price, stock_qty=stock_qty, barcode=barcode,
        min_order_qty=min_order_qty, weight=weight, dimensions=dimensions, uom=uom, is_active=is_active, is_taxable=is_taxable,
        is_perishable=is_perishable
    )
    new_product = ProductService.create_product(
        db=db, product_in=product_in, color_id=color_id, size_id=size_id, image_files=image_files, current_user_id=current_user.user_id
    )
    return APIResponse.success(code=201, message="Product entry and physical local media initialized successfully", data=new_product)


@router.put("/{product_id}", response_model=APIResponse[ProductResponseData])
def update_product_metadata(
    product_id: UUID, payload: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:update_product"))
):
    updated_product = ProductService.update_product(db=db, product_id=product_id, product_in=payload, current_user_id=current_user.user_id)
    return APIResponse.success(code=200, message="Product parameters customized and synced safely", data=updated_product)


@router.delete("/{product_id}", response_model=APIResponse[dict])
def terminate_product_record(
    product_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:delete_product"))
):
    ProductService.delete_product(db=db, product_id=product_id)
    return APIResponse.success(code=200, message="Product record context and matching local media storage dropped thoroughly", data={})


# =========================================================================
# 🧬 DIRECT PRODUCT VARIANT RESOURCE ROUTING SUITE
# =========================================================================

@router.get("/variants/{product_variant_id}", response_model=APIResponse[ProductVariantRead])
def get_product_variant_by_id(
    product_variant_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:view_product"))
):
    variant_db = ProductService.get_product_variant_by_id(db=db, product_variant_id=product_variant_id)
    return APIResponse.success(code=200, message="Target product variant context loaded successfully", data=variant_db)


@router.post("/{product_id}/variants", response_model=APIResponse[ProductVariantRead], status_code=status.HTTP_201_CREATED)
def append_product_variant(
    product_id: UUID,
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: List[UploadFile] = File(default_factory=list),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:create_product"))
):
    new_variant_db = ProductService.create_product_variant(
        db=db, product_id=product_id, color_id=color_id, size_id=size_id, image_files=image_files
    )
    return APIResponse.success(code=201, message="Additional SKU variant options and local files injected cleanly", data=new_variant_db)


@router.put("/variants/{product_variant_id}", response_model=APIResponse[ProductVariantRead])
def update_product_variant(
    product_variant_id: UUID,
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:update_product"))
):
    variant_in = ProductVariantUpdate(color_id=color_id, size_id=size_id)
    updated_variant_db = ProductService.update_product_variant(
        db=db, product_variant_id=product_variant_id, variant_in=variant_in, image_files=image_files
    )
    return APIResponse.success(code=200, message="Variation mapping properties updated seamlessly", data=updated_variant_db)


@router.delete("/variants/{product_variant_id}", response_model=APIResponse[dict])
def delete_product_variant(
    product_variant_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(PermissionChecker("product:delete_product"))
):
    ProductService.delete_product_variant(db=db, product_variant_id=product_variant_id)
    return APIResponse.success(code=200, message="Variation node discarded from target production matrix cleanly", data={})
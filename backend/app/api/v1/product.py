from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductResponseData
from app.services.product_service import ProductService
from app.schemas.response_schema import APIResponse  # Adjust this import to match your actual wrapper path

# Adjust these auth imports if your setup looks different
from app.models.user_model import User
from app.core.dependency import PermissionChecker 

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=APIResponse[ProductResponseData], status_code=status.HTTP_201_CREATED)
def create_product_with_initial_variant(
    sku: str = Form(...),
    product_name: str = Form(...),
    business_category_id: UUID = Form(...),
    department_id: UUID = Form(...),
    category_id: UUID = Form(...),
    sub_category_id: UUID = Form(...),
    product_type_id: UUID = Form(...),
    upc_ean: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    long_description: Optional[str] = Form(None),
    brand_id: Optional[UUID] = Form(None),
    supplier_id: Optional[UUID] = Form(None),
    material_id: Optional[UUID] = Form(None),
    cost_price: float = Form(0.00),
    selling_price: float = Form(0.00),
    stock_qty: int = Form(0),
    barcode: Optional[str] = Form(None),
    min_order_qty: int = Form(1),
    weight: Optional[float] = Form(None),
    dimensions: Optional[str] = Form(None),
    uom: Optional[str] = Form(None),
    is_active: bool = Form(True),
    is_taxable: bool = Form(True),
    is_perishable: bool = Form(False),
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: List[UploadFile] = File(default_factory=list),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:create_product"))
):
    # 1. Package form fields into the expected creation schema structure
    product_in = ProductCreate(
        sku=sku,
        product_name=product_name,
        business_category_id=business_category_id,
        department_id=department_id,
        category_id=category_id,
        sub_category_id=sub_category_id,
        product_type_id=product_type_id,
        upc_ean=upc_ean,
        short_description=short_description,
        long_description=long_description,
        brand_id=brand_id,
        supplier_id=supplier_id,
        material_id=material_id,
        cost_price=cost_price,
        selling_price=selling_price,
        stock_qty=stock_qty,
        barcode=barcode,
        min_order_qty=min_order_qty,
        weight=weight,
        dimensions=dimensions,
        uom=uom,
        is_active=is_active,
        is_taxable=is_taxable,
        is_perishable=is_perishable
    )
    
    # 2. Fire creation sequence (returns a pre-validated ProductResponseData object)
    validated_product = ProductService.create_product(
        db=db,
        product_in=product_in,
        color_id=color_id,
        size_id=size_id,
        image_files=image_files,
        current_user_id=current_user.user_id
    )
    
    return APIResponse.success(
        code=201, 
        message="Product entry and physical local media initialized successfully", 
        data=validated_product
    )


@router.get("", response_model=APIResponse[List[ProductResponseData]])
def list_all_products(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    is_active: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:view_product"))
):
    validated_products = ProductService.get_all_products(
        db=db, limit=limit, offset=offset, is_active=is_active, search=search
    )
    return APIResponse.success(
        code=200, 
        message="Catalog portfolio listings compiled cleanly", 
        data=validated_products
    )


@router.get("/{product_id}", response_model=APIResponse[ProductResponseData])
def get_product_by_id(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:view_product"))
):
    validated_product = ProductService.get_product_by_id(db=db, product_id=product_id)
    return APIResponse.success(
        code=200, 
        message="Target product structure layout pulled", 
        data=validated_product
    )


@router.put("/{product_id}", response_model=APIResponse[ProductResponseData])
def update_product(
    product_id: UUID,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:update_product"))
):
    validated_product = ProductService.update_product(
        db=db, product_id=product_id, product_in=product_in, current_user_id=current_user.user_id
    )
    return APIResponse.success(
        code=200, 
        message="Product entry fields updated successfully", 
        data=validated_product
    )


@router.delete("/{product_id}", response_model=APIResponse[dict])
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:delete_product"))
):
    ProductService.delete_product(db=db, product_id=product_id)
    return APIResponse.success(
        code=200, 
        message="Product and all corresponding variation data dropped cleanly", 
        data={"product_id": product_id}
    )

@router.post("/{product_id}/variants", response_model=APIResponse[ProductResponseData], status_code=status.HTTP_201_CREATED)
def create_product_variant(
    product_id: UUID,
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:update_product"))
):
    # Ensure it's a list even if no files were uploaded
    files = image_files if image_files is not None else []
    
    updated_product = ProductService.create_variant(
        db=db, product_id=product_id, color_id=color_id, size_id=size_id, image_files=files
    )
    return APIResponse.success(code=201, message="Variant added successfully", data=updated_product)


@router.put("/variants/{variant_id}", response_model=APIResponse[ProductResponseData])
def update_product_variant(
    variant_id: UUID,
    color_id: Optional[UUID] = Form(None),
    size_id: Optional[UUID] = Form(None),
    image_files: Optional[List[UploadFile]] = File(None), # 👈 Changed to Optional List of binary files
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:update_product"))
):
    variant_in = ProductVariantUpdate(color_id=color_id, size_id=size_id)
    
    updated_product = ProductService.update_variant(
        db=db, variant_id=variant_id, variant_in=variant_in, image_files=image_files
    )
    return APIResponse.success(code=200, message="Variant updated successfully", data=updated_product)

@router.delete("/variants/{variant_id}", response_model=APIResponse[dict])
def delete_product_variant(
    variant_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(PermissionChecker("product:update_product"))
):
    parent_id = ProductService.delete_variant(db=db, variant_id=variant_id)
    return APIResponse.success(code=200, message="Variant configuration dropped", data={"product_id": parent_id})
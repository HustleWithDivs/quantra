import logging
import csv
import io
import os
import json
from uuid import uuid4, UUID
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.customer_order_model import Customer, Order, CustomerOrderHistory
from app.models.product_model import Product

# --- Ingestion Hourly File Logger Configuration ---
timestamp = datetime.now().strftime("%Y%m%d_%H")
logger = logging.getLogger("customer_order_engine")
logger.setLevel(logging.INFO)

LOG_FILE_PATH = f"/app/logs/customer_order_ingestion_{timestamp}.log"
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

if not logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE_PATH, encoding="utf-8")
    file_formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)
    logger.propagate = False

class CustomerOrderIngestionEngine:

    @classmethod
    def process_csv_async(cls, db_session_factory, file_bytes: bytes, column_map: Dict[str, str], current_user_id: Optional[UUID] = None):
        """Processes binary file streams downstream in a safe worker background execution layer."""
        db: Session = db_session_factory()
        success_count = 0
        failure_count = 0

        logger.info("======================================================================")
        logger.info("⚡ BULK CUSTOMER/ORDER UPSERT PIPELINE INITIALIZED ⚡")
        logger.info("======================================================================")

        try:
            csv_content = file_bytes.decode("utf-8")
            f = io.StringIO(csv_content)
            reader = csv.DictReader(f)

            # Normalize column mapping keys to lowercase/stripped entries
            normalized_map = {k.strip().lower(): v.strip().lower() for k, v in column_map.items()}

            for index, raw_row in enumerate(reader, start=1):
                # Normalize row data
                clean_row = {str(k).strip().lower(): str(v).strip() for k, v in raw_row.items() if k is not None}
                logger.info(f"--- [ROW #{index}] Processing Pipeline Segment ---")

                try:
                    # Dynamically reconstruct values based on user map
                    mapped_row = {}
                    for file_header_lower, target_field_lower in normalized_map.items():
                        if file_header_lower in clean_row:
                            mapped_row[target_field_lower] = clean_row[file_header_lower]

                    # Inline parsing function
                    def grab(field_name: str, fallback: Any = None) -> Any:
                        return mapped_row.get(field_name) or clean_row.get(field_name) or fallback

                    # Extract natural unique business validation properties
                    source = grab("source")
                    src_cust_id = grab("source_customer_id")
                    invoice = grab("invoice_number")
                    sku_string = grab("sku") or grab("product_id")  # Try matching SKU column first

                    if not source or not src_cust_id or not invoice or not sku_string:
                        logger.warning(f"❌ [Row #{index}] Skipped: Missing composite key configurations (source, source_customer_id, invoice_number, sku/product_id).")
                        failure_count += 1
                        continue

                    # -------------------------------------------------------------
                    # DYNAMIC DATE RESOLUTION LOGIC
                    # -------------------------------------------------------------
                    csv_created_at_raw = grab("created_at") or grab("order_creation_date")
                    row_timestamp = datetime.utcnow()  # Fallback to current datetime

                    if csv_created_at_raw:
                        try:
                            # Safely handle potential ISO formatting offsets
                            row_timestamp = datetime.fromisoformat(csv_created_at_raw.replace("Z", "+00:00"))
                        except ValueError:
                            logger.warning(f"⚠️ [Row #{index}] Could not parse datetime string '{csv_created_at_raw}'. Defaulting to system time.")

                    # -------------------------------------------------------------
                    # LOOKUP STEP 1: Fetch country_id from country_with_currencies
                    # -------------------------------------------------------------
                    country_name_string = grab("country")
                    country_id_bigint = None

                    if country_name_string:
                        country_id_bigint = db.execute(
                            text("SELECT country_id FROM country_with_currencies WHERE country = :name LIMIT 1"),
                            {"name": country_name_string}
                        ).scalar()

                        if not country_id_bigint:
                            logger.warning(f"⚠️ [Row #{index}] Country '{country_name_string}' not matched in reference list. Using NULL ID.")

                    # -------------------------------------------------------------
                    # LOOKUP STEP 2: Fetch product_id (UUID) via SKU master table lookup
                    # -------------------------------------------------------------
                    product_record = db.query(Product).filter(Product.sku == sku_string).first()
                    
                    if not product_record:
                        logger.warning(f"❌ [Row #{index}] Skipped: Product SKU '{sku_string}' does not exist in the master Product table Catalog.")
                        failure_count += 1
                        continue
                    
                    resolved_product_id = product_record.product_id

                    # -------------------------------------------------------------
                    # STEP 1: UPSERT CUSTOMER NODE
                    # -------------------------------------------------------------
                    customer = db.query(Customer).filter(
                        Customer.source == source,
                        Customer.source_customer_id == src_cust_id
                    ).first()

                    dob_parsed = None
                    if grab("date_of_birth"):
                        try:
                            dob_parsed = datetime.fromisoformat(grab("date_of_birth").replace("Z", "+00:00"))
                        except ValueError:
                            pass

                    if not customer:
                        customer = Customer(
                            customer_id=uuid4(),
                            first_name=grab("first_name", "Unknown"),
                            last_name=grab("last_name", "Unknown"),
                            email=grab("email"),
                            telephone=grab("telephone"),
                            address=grab("address"),
                            city=grab("city"),
                            country=country_id_bigint,
                            gender=grab("gender"),
                            date_of_birth=dob_parsed,
                            is_active=str(grab("is_active", "true")).lower() == "true",
                            source=source,
                            source_customer_id=src_cust_id,
                            created_by=current_user_id,
                            created_at=row_timestamp  # Applied dynamic date
                        )
                        db.add(customer)
                        logger.info(f"   [CUSTOMER CREATED] Source: {source} | ID: {src_cust_id}")
                    else:
                        customer.first_name = grab("first_name", customer.first_name)
                        customer.last_name = grab("last_name", customer.last_name)
                        customer.email = grab("email", customer.email)
                        customer.telephone = grab("telephone", customer.telephone)
                        customer.address = grab("address", customer.address)
                        customer.city = grab("city", customer.city)
                        customer.country = country_id_bigint if country_id_bigint else customer.country
                        customer.gender = grab("gender", customer.gender)
                        if dob_parsed:
                            customer.date_of_birth = dob_parsed
                        customer.is_active = str(grab("is_active", str(customer.is_active))).lower() == "true"
                        customer.modified_by = current_user_id
                        customer.modified_at = row_timestamp  # Applied dynamic date
                        logger.info(f"   [CUSTOMER UPDATED] Internal ID: {customer.customer_id}")

                    db.flush()

                    # -------------------------------------------------------------
                    # STEP 2: UPSERT ORDER NODE
                    # -------------------------------------------------------------
                    order = db.query(Order).filter(Order.invoice_number == invoice).first()

                    if not order:
                        order = Order(
                            order_id=uuid4(),
                            invoice_number=invoice,
                            customer_id=customer.customer_id,
                            cart_value=float(grab("cart_value", 0.0)),
                            total_amount=float(grab("total_amount", 0.0)),
                            discount=float(grab("discount", 0.0)),
                            coupon_applied=grab("coupon_applied"),
                            status=grab("status", "Pending"),
                            currency=grab("currency", "USD"),
                            is_active=str(grab("is_active", "true")).lower() == "true",
                            created_by=current_user_id,
                            created_at=row_timestamp  # Applied dynamic date
                        )
                        db.add(order)
                        logger.info(f"   [ORDER CREATED] Invoice: {invoice}")
                    else:
                        order.customer_id = customer.customer_id
                        order.cart_value = float(grab("cart_value", order.cart_value))
                        order.total_amount = float(grab("total_amount", order.total_amount))
                        order.discount = float(grab("discount", order.discount))
                        order.coupon_applied = grab("coupon_applied", order.coupon_applied)
                        order.status = grab("status", order.status)
                        order.currency = grab("currency", order.currency)
                        order.is_active = str(grab("is_active", str(order.is_active))).lower() == "true"
                        order.modified_by = current_user_id
                        order.modified_at = row_timestamp  # Applied dynamic date
                        logger.info(f"   [ORDER UPDATED] Internal ID: {order.order_id}")

                    db.flush()

                    # -------------------------------------------------------------
                    # STEP 3: UPSERT CUSTOMER ORDER HISTORY NODE (Composite Key Supported)
                    # -------------------------------------------------------------
                    history = db.query(CustomerOrderHistory).filter(
                        CustomerOrderHistory.order_id == order.order_id,
                        CustomerOrderHistory.product_id == resolved_product_id,
                    ).first()

                    if not history:
                        history = CustomerOrderHistory(
                            order_id=order.order_id,
                            product_id=resolved_product_id,
                            is_discounted=str(grab("is_discounted", "false")).lower() == "true",
                            price=float(grab("price", 0.0)),
                            quantity=int(grab("quantity", 1)),
                            total=float(grab("total", 0.0)),
                            sales_price=float(grab("sales_price", 0.0)),
                            is_active=str(grab("is_active", "true")).lower() == "true",
                            created_by=current_user_id,
                            created_at=row_timestamp  # Applied dynamic date
                        )
                        db.add(history)
                        logger.info(f"   [HISTORY CREATED] Item Linked -> Target Product UUID: {resolved_product_id}")
                    else:
                        history.is_discounted = str(grab("is_discounted", str(history.is_discounted))).lower() == "true"
                        history.price = float(grab("price", history.price))
                        history.quantity = int(grab("quantity", history.quantity))
                        history.total = float(grab("total", history.total))
                        history.sales_price = float(grab("sales_price", history.sales_price))
                        history.is_active = str(grab("is_active", str(history.is_active))).lower() == "true"
                        history.modified_by = current_user_id
                        history.modified_at = row_timestamp  # Applied dynamic date
                        logger.info("   [HISTORY UPDATED] Existing Item Record Alignment Modified.")

                    success_count += 1
                    
                    if success_count % 50 == 0:
                        db.commit()

                except Exception as row_err:
                    db.rollback()
                    logger.error(f"❌ [Row #{index}] Transaction Rollback. Error: {str(row_err)}")
                    failure_count += 1

            db.commit()
        except Exception as global_err:
            db.rollback()
            logger.error(f"🚨 Critical Failure in Ingestion Process: {str(global_err)}")
        finally:
            db.close()
            logger.info("======================================================================")
            logger.info(f"🏁 PROCESS COMPLETE -> Success Upserts: {success_count} | Failures: {failure_count}")
            logger.info("======================================================================")
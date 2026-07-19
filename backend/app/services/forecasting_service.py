from datetime import datetime, timedelta
import pandas as pd
import xgboost as xgb
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from uuid import UUID

from app.models.forecasting_model import ForecastRun, ForecastValue
from app.schemas.forecasting_schema import ForecastGenerationRequest
from app.models.customer_order_model import CustomerOrderHistory
from app.models.product_model import Product

class ForecastingService:
    
    @staticmethod
    def fetch_historical_data(db: Session, request: ForecastGenerationRequest) -> pd.DataFrame:
        """
        Queries records using clean ORM mappings targeting true primary key fields.
        """
        # Corrected table column references and primary-key join structures
        stmt = (
            select(
                CustomerOrderHistory.created_at,
                CustomerOrderHistory.quantity,
                Product.brand_id,
                Product.category_id,
                Product.sub_category_id,
                Product.product_id
            )
            .join(Product, CustomerOrderHistory.product_id == Product.product_id)
            .where(CustomerOrderHistory.is_active == True)
        )
    
        results = db.execute(stmt).all()
        if not results:
            return pd.DataFrame()
        
        df = pd.DataFrame([dict(row._mapping) for row in results])
        df['created_at'] = pd.to_datetime(df['created_at'])
    
        # Filter matching based directly on structural UUID keys
        if request.level != "overall" and request.selection_uuid is not None:
            if request.level == "brand":
                df = df[df['brand_id'] == request.selection_uuid]    
            elif request.level == "category":
                df = df[df['category_id'] == request.selection_uuid]
            elif request.level == "subcategory":
                df = df[df['sub_category_id'] == request.selection_uuid]
            elif request.level == "product":
                df = df[df['product_id'] == request.selection_uuid]
        return df       

    @classmethod
    def generate_and_save_forecast(cls, db: Session, request: ForecastGenerationRequest) -> ForecastRun:
        df_raw = cls.fetch_historical_data(db, request)
        if df_raw.empty:
            raise ValueError(f"Insufficient transaction history for level {request.level} matching selection selection_uuid.")

        # 1. Force native numeric types
        df_raw['quantity'] = df_raw['quantity'].astype(float)

        # 2. Strip timezone/time components safely
        df_raw['created_at'] = pd.to_datetime(df_raw['created_at']).dt.tz_localize(None).dt.date
        
        # 3. Aggregate by pure calendar day
        daily = df_raw.groupby('created_at').agg({'quantity': 'sum'}).reset_index()
        daily = daily.rename(columns={'created_at': 'date'})
        
        # 4. Sort and establish daily frequency seamlessly
        daily['date'] = pd.to_datetime(daily['date'])
        daily = daily.sort_values('date').set_index('date')
        daily = daily.asfreq('D', fill_value=0.0).reset_index()

        # 5. Feature Engineering
        daily['year'] = daily['date'].dt.year
        daily['month'] = daily['date'].dt.month
        daily['day'] = daily['date'].dt.day
        daily['dayofweek'] = daily['date'].dt.dayofweek

        for lag in [1, 2, 3, 7]:
            daily[f'qty_lag_{lag}'] = daily['quantity'].shift(lag, fill_value=0.0).astype(float)
        daily['rolling_mean'] = daily['quantity'].shift(1).rolling(window=3, min_periods=1).mean().fillna(0.0).astype(float)

        features = ['year', 'month', 'day', 'dayofweek', 'qty_lag_1', 'qty_lag_2', 'qty_lag_3', 'qty_lag_7', 'rolling_mean']
        
        # Model Configuration
        model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42)
        model.fit(daily[features], daily['quantity'])

        value_records = []

        # --- NEW: Append the Historical (Current) Data First ---
        for _, row in daily.iterrows():
            value_records.append(ForecastValue(
                forecast_date=row['date'].date(),
                predicted_quantity=round(float(row['quantity']), 2)
            ))

        # Recursive Forecasting Loop for Future Predictions
        future_history = daily.copy()
        current_date = future_history['date'].max()

        for _ in range(request.days_to_predict):
            current_date += timedelta(days=1)
            step = {
                'date': current_date, 
                'year': int(current_date.year), 
                'month': int(current_date.month),
                'day': int(current_date.day), 
                'dayofweek': int(current_date.dayofweek)
            }
            
            step['qty_lag_1'] = float(future_history['quantity'].iloc[-1]) if len(future_history) >= 1 else 0.0
            step['qty_lag_2'] = float(future_history['quantity'].iloc[-2]) if len(future_history) >= 2 else 0.0
            step['qty_lag_3'] = float(future_history['quantity'].iloc[-3]) if len(future_history) >= 3 else 0.0
            step['qty_lag_7'] = float(future_history['quantity'].iloc[-7]) if len(future_history) >= 7 else float(future_history['quantity'].mean())
            
            w_size = min(3, len(future_history))
            step['rolling_mean'] = float(future_history['quantity'].iloc[-w_size:].mean()) if w_size > 0 else 0.0

            pred_df = pd.DataFrame([step])
            pred_qty = max(0.0, float(model.predict(pred_df[features])[0]))
            
            pred_df['quantity'] = pred_qty
            future_history = pd.concat([future_history, pred_df], ignore_index=True)

            # --- Append the Predictions onto the same list ---
            value_records.append(ForecastValue(
                forecast_date=current_date.date(),
                predicted_quantity=round(pred_qty, 2)
            ))

        run_record = ForecastRun(
            level=request.level,
            selection_uuid=request.selection_uuid,
            days_forecasted=request.days_to_predict,
            model_version="xgboost_v1.0",
            values=value_records
        )
        
        db.add(run_record)
        db.commit()
        db.refresh(run_record)
        return run_record

    @staticmethod
    def get_latest_forecast(db: Session, level: str, selection_uuid: Optional[UUID]) -> Optional[ForecastRun]:
        return db.query(ForecastRun).filter(
            ForecastRun.level == level,
            ForecastRun.selection_uuid == selection_uuid
        ).order_by(ForecastRun.created_at.desc()).first()
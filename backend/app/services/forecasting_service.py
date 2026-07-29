from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import xgboost as xgb
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional, List
from uuid import UUID

from app.models.forecasting_model import ForecastRun, ForecastValue
from app.models.customer_order_model import CustomerOrderHistory
from app.models.product_model import Product
from app.schemas.forecasting_schema import (
    ForecastGenerationRequest,
    ForecastRunResponseData,
    ForecastMetrics,
    ChartPoint,
)


class ForecastingService:

    @staticmethod
    def fetch_historical_data(db: Session, request: ForecastGenerationRequest) -> pd.DataFrame:
        stmt = (
            select(
                CustomerOrderHistory.created_at,
                CustomerOrderHistory.quantity,
                Product.brand_id,
                Product.category_id,
                Product.sub_category_id,
                Product.product_id,
            )
            .join(Product, CustomerOrderHistory.product_id == Product.product_id)
            .where(CustomerOrderHistory.is_active == True)
        )

        results = db.execute(stmt).all()
        if not results:
            return pd.DataFrame()

        df = pd.DataFrame([dict(row._mapping) for row in results])
        df['created_at'] = pd.to_datetime(df['created_at'])

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
            raise ValueError(f"Insufficient transaction history for level '{request.level}' matching selection.")

        df_raw['quantity'] = df_raw['quantity'].astype(float)
        df_raw['created_at'] = pd.to_datetime(df_raw['created_at']).dt.tz_localize(None)

        daily = df_raw.groupby(df_raw['created_at'].dt.date).agg({'quantity': 'sum'}).reset_index()
        daily = daily.rename(columns={'created_at': 'date'})

        daily['date'] = pd.to_datetime(daily['date'])
        daily = daily.sort_values('date').set_index('date')
        daily = daily.asfreq('D', fill_value=0.0).reset_index()

        daily['year'] = daily['date'].dt.year
        daily['month'] = daily['date'].dt.month
        daily['day'] = daily['date'].dt.day
        daily['dayofweek'] = daily['date'].dt.dayofweek

        for lag in [1, 2, 3, 7]:
            daily[f'qty_lag_{lag}'] = daily['quantity'].shift(lag, fill_value=0.0).astype(float)
        daily['rolling_mean'] = (
            daily['quantity'].shift(1).rolling(window=3, min_periods=1).mean().fillna(0.0).astype(float)
        )

        features = ['year', 'month', 'day', 'dayofweek', 'qty_lag_1', 'qty_lag_2', 'qty_lag_3', 'qty_lag_7', 'rolling_mean']

        model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42)
        model.fit(daily[features], daily['quantity'])

        value_records: List[ForecastValue] = []

        # Save historical daily records
        for _, row in daily.iterrows():
            value_records.append(
                ForecastValue(
                    forecast_date=row['date'].to_pydatetime(),
                    predicted_quantity=round(float(row['quantity']), 2),
                )
            )

        # Recursive forecast loop
        future_history = daily.copy()
        current_date = future_history['date'].max()

        for _ in range(request.days_to_predict):
            current_date += timedelta(days=1)
            step = {
                'date': current_date,
                'year': int(current_date.year),
                'month': int(current_date.month),
                'day': int(current_date.day),
                'dayofweek': int(current_date.dayofweek),
            }

            step['qty_lag_1'] = float(future_history['quantity'].iloc[-1]) if len(future_history) >= 1 else 0.0
            step['qty_lag_2'] = float(future_history['quantity'].iloc[-2]) if len(future_history) >= 2 else 0.0
            step['qty_lag_3'] = float(future_history['quantity'].iloc[-3]) if len(future_history) >= 3 else 0.0
            step['qty_lag_7'] = (
                float(future_history['quantity'].iloc[-7])
                if len(future_history) >= 7
                else float(future_history['quantity'].mean())
            )

            w_size = min(3, len(future_history))
            step['rolling_mean'] = (
                float(future_history['quantity'].iloc[-w_size:].mean()) if w_size > 0 else 0.0
            )

            pred_df = pd.DataFrame([step])
            pred_qty = max(0.0, float(model.predict(pred_df[features])[0]))

            pred_df['quantity'] = pred_qty
            future_history = pd.concat([future_history, pred_df], ignore_index=True)

            value_records.append(
                ForecastValue(
                    forecast_date=current_date.to_pydatetime(),
                    predicted_quantity=round(pred_qty, 2),
                )
            )

        run_record = ForecastRun(
            level=request.level,
            selection_uuid=request.selection_uuid,
            days_forecasted=request.days_to_predict,
            model_version="xgboost_v1.0",
            values=value_records,
        )

        db.add(run_record)
        db.commit()
        db.refresh(run_record)
        return run_record

    @classmethod
    def format_forecast_response(cls, db: Session, run: ForecastRun) -> ForecastRunResponseData:
        cutoff_date = run.created_at

        # Build raw DataFrame from values
        data = [{'date': v.forecast_date, 'qty': v.predicted_quantity} for v in run.values]
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])

        # Monthly Aggregation
        df['year_month'] = df['date'].dt.to_period('M')
        monthly = df.groupby('year_month').agg({'qty': 'sum', 'date': 'min'}).reset_index()

        chart_points: List[ChartPoint] = []
        transition_idx = -1

        for idx, row in monthly.iterrows():
            d_val = row['date']
            label = d_val.strftime('%b %y')
            is_future = d_val > cutoff_date

            if is_future and transition_idx == -1:
                transition_idx = idx

            chart_points.append(
                ChartPoint(
                    date_label=label,
                    actual_quantity=round(float(row['qty']), 2) if not is_future else None,
                    forecast_quantity=round(float(row['qty']), 2) if is_future else None,
                    is_forecast=is_future,
                )
            )

        # Bridge transition gap between solid and dashed chart lines
        if transition_idx > 0 and transition_idx < len(chart_points):
            chart_points[transition_idx - 1].forecast_quantity = chart_points[transition_idx - 1].actual_quantity

        # --- DYNAMIC METRICS CALCULATION ---
        hist_monthly = monthly[monthly['date'] <= cutoff_date]
        fut_monthly = monthly[monthly['date'] > cutoff_date]

        current_month_qty = hist_monthly['qty'].iloc[-1] if not hist_monthly.empty else 1.0

        # 1. Predicted Peak Month & Growth
        if not fut_monthly.empty:
            peak_row = fut_monthly.loc[fut_monthly['qty'].idxmax()]
            peak_month_str = peak_row['date'].strftime('%B %Y')
            peak_val = peak_row['qty']
            growth_pct = ((peak_val - current_month_qty) / max(current_month_qty, 1.0)) * 100
            peak_growth_str = f"{'+' if growth_pct >= 0 else ''}{growth_pct:.1f}% vs current"
        else:
            peak_month_str = "N/A"
            peak_growth_str = "0% vs current"

        # 2. Avg Monthly Growth (Compound Monthly Growth Rate across historical period)
        if len(hist_monthly) > 1:
            first_val = hist_monthly['qty'].iloc[0]
            last_val = hist_monthly['qty'].iloc[-1]
            n_months = len(hist_monthly) - 1
            if first_val > 0:
                cmgr = ((last_val / first_val) ** (1 / n_months) - 1) * 100
                avg_growth_str = f"{cmgr:.1f}%"
            else:
                avg_growth_str = "0.0%"
        else:
            avg_growth_str = "0.0%"

        # 3. Confidence Interval (Calculated from historical residual standard error)
        if len(hist_monthly) > 2:
            std_dev = hist_monthly['qty'].std()
            mean_val = hist_monthly['qty'].mean()
            ci_pct = (std_dev / max(mean_val, 1.0)) * 100 * 1.96 / np.sqrt(len(hist_monthly))
            confidence_str = f"±{ci_pct:.1f}%"
        else:
            confidence_str = "±5.0%"

        # 4. Seasonality Factor (Ratio of peak month average to baseline average)
        if not hist_monthly.empty:
            overall_avg = hist_monthly['qty'].mean()
            max_monthly_avg = hist_monthly.groupby(hist_monthly['date'].dt.month)['qty'].mean().max()
            seasonality = max_monthly_avg / max(overall_avg, 1.0)
            seasonality_str = f"{seasonality:.2f}x"
        else:
            seasonality_str = "1.00x"

        metrics = ForecastMetrics(
            predicted_peak_month=peak_month_str,
            predicted_peak_growth=peak_growth_str,
            avg_monthly_growth=avg_growth_str,
            confidence_interval=confidence_str,
            seasonality_factor=seasonality_str,
        )

        return ForecastRunResponseData(
            id=run.id,
            created_at=run.created_at,
            level=run.level,
            selection_uuid=run.selection_uuid,
            model_version=run.model_version,
            days_forecasted=run.days_forecasted,
            metrics=metrics,
            chart_points=chart_points,
        )

    @staticmethod
    def get_latest_forecast(db: Session, level: str, selection_uuid: Optional[UUID]) -> Optional[ForecastRun]:
        return (
            db.query(ForecastRun)
            .filter(ForecastRun.level == level, ForecastRun.selection_uuid == selection_uuid)
            .order_by(ForecastRun.created_at.desc())
            .first()
        )
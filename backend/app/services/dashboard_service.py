from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.customer_order_model import CustomerOrderHistory
from app.models.product_model import Product
from app.models.forecasting_model import ForecastRun, ForecastValue
from app.schemas.dashboard_schema import (
    DashboardOverviewResponse,
    DashboardMetricCard,
    DashboardChartPoint,
)


class DashboardService:

    @classmethod
    def get_dashboard_metrics(cls, db: Session) -> DashboardOverviewResponse:
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)

        # 1. Database Queries for Sales & Inventory Stats
        sales_30d = db.execute(
            select(
                func.coalesce(func.sum(CustomerOrderHistory.quantity), 0).label("units"),
                func.coalesce(func.sum(CustomerOrderHistory.total), 0.0).label("revenue")
            ).where(
                CustomerOrderHistory.is_active == True,
                CustomerOrderHistory.created_at >= thirty_days_ago
            )
        ).one()

        active_products = db.execute(
            select(func.count(Product.product_id)).where(Product.is_active == True)
        ).scalar() or 0

        # 2. Retrieve Latest Overall Forecast Run from Database
        latest_forecast_run = (
            db.query(ForecastRun)
            .filter(ForecastRun.level == "overall")
            .order_by(ForecastRun.created_at.desc())
            .first()
        )

        chart_data_points: list[DashboardChartPoint] = []

        if latest_forecast_run and latest_forecast_run.values:
            val_data = [
                {
                    "date": v.forecast_date,
                    "qty": v.predicted_quantity,
                    "is_forecast": v.is_forecast if hasattr(v, "is_forecast") else False
                }
                for v in latest_forecast_run.values
            ]
            df = pd.DataFrame(val_data)
            df["date"] = pd.to_datetime(df["date"])
            df["year_month"] = df["date"].dt.to_period("M")

            monthly = df.groupby(["year_month", "is_forecast"]).agg(
                {"qty": "sum", "date": "min"}
            ).reset_index()

            cutoff_date = latest_forecast_run.created_at
            hist_monthly = monthly[monthly["date"] <= cutoff_date]
            fut_monthly = monthly[monthly["date"] > cutoff_date]

            curr_qty = hist_monthly["qty"].iloc[-1] if not hist_monthly.empty else 1.0

            # Dynamic Metrics Calculations
            if not fut_monthly.empty:
                peak_row = fut_monthly.loc[fut_monthly["qty"].idxmax()]
                peak_month_str = peak_row["date"].strftime("%B %Y")
                peak_val = peak_row["qty"]
                growth_pct = ((peak_val - curr_qty) / max(curr_qty, 1.0)) * 100
                peak_growth_str = f"{'+' if growth_pct >= 0 else ''}{growth_pct:.1f}% vs current"
            else:
                peak_month_str, peak_growth_str = "N/A", "0%"

            if len(hist_monthly) > 1:
                first_val = hist_monthly["qty"].iloc[0]
                last_val = hist_monthly["qty"].iloc[-1]
                n_months = len(hist_monthly) - 1
                cmgr = (((last_val / max(first_val, 1.0)) ** (1 / n_months)) - 1) * 100
                avg_growth_str = f"{cmgr:.1f}%"
            else:
                avg_growth_str = "0.0%"

            if len(hist_monthly) > 2:
                std_dev = hist_monthly["qty"].std()
                mean_val = hist_monthly["qty"].mean()
                ci_pct = (std_dev / max(mean_val, 1.0)) * 100 * 1.96 / np.sqrt(len(hist_monthly))
                ci_str = f"±{ci_pct:.1f}%"
            else:
                ci_str = "±5.0%"

            if not hist_monthly.empty:
                overall_avg = hist_monthly["qty"].mean()
                peak_avg = hist_monthly.groupby(hist_monthly["date"].dt.month)["qty"].mean().max()
                seasonality = peak_avg / max(overall_avg, 1.0)
                seasonality_str = f"{seasonality:.2f}x"
            else:
                seasonality_str = "1.00x"

            # Build 90-day Chart Points Array (Historical Actuals + Future Predictions)
            for _, row in monthly.sort_values("date").iterrows():
                date_str = row["date"].strftime("%b %Y")
                if row["is_forecast"]:
                    chart_data_points.append(
                        DashboardChartPoint(
                            date_label=date_str,
                            forecast_quantity=float(row["qty"]),
                            is_forecast=True,
                        )
                    )
                else:
                    chart_data_points.append(
                        DashboardChartPoint(
                            date_label=date_str,
                            actual_quantity=float(row["qty"]),
                            is_forecast=False,
                        )
                    )
        else:
            peak_month_str, peak_growth_str = "N/A", "0%"
            avg_growth_str = "0.0%"
            ci_str = "±0.0%"
            seasonality_str = "1.00x"

        return DashboardOverviewResponse(
            predicted_peak_month=DashboardMetricCard(
                title="Predicted Peak Month",
                value=peak_month_str,
                subtext=peak_growth_str
            ),
            avg_monthly_growth=DashboardMetricCard(
                title="Avg Monthly Growth",
                value=avg_growth_str,
                subtext="Based on database order history"
            ),
            confidence_interval=DashboardMetricCard(
                title="Confidence Interval",
                value=ci_str,
                subtext="95% confidence level"
            ),
            seasonality_factor=DashboardMetricCard(
                title="Seasonality Factor",
                value=seasonality_str,
                subtext="Calculated Q1/Annual variance"
            ),
            total_revenue_30d=float(sales_30d.revenue),
            total_units_sold_30d=int(sales_30d.units),
            active_products_count=active_products,
            chart_data=chart_data_points,
        )
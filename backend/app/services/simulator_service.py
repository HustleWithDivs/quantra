from uuid import UUID
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.product_model import Product
from app.services.forecasting_service import ForecastingService
from app.schemas.forecasting_schema import ForecastGenerationRequest
from app.schemas.simulator_schema import SimulationRequest, SimulationResponseData


class SimulatorService:

    @classmethod
    def run_simulation(cls, db: Session, request: SimulationRequest) -> SimulationResponseData:
        # 1. Fetch aggregated product master metrics (or fallback to single product if specific)
        if request.level == "overall":
            # Aggregate enterprise-wide weighted averages & totals
            totals = db.query(
                func.avg(Product.selling_price).label("avg_price"),
                func.avg(Product.cost_price).label("avg_cost"),
                func.sum(Product.stock_qty).label("total_stock"),
                func.avg(Product.min_order_qty).label("avg_min_order")
            ).filter(Product.is_active == True).first()

            unit_price = float(totals.avg_price or 100.0)
            unit_cost = float(totals.avg_cost or 60.0)
            current_inventory = float(totals.total_stock or 10000.0)
            min_order_qty = float(totals.avg_min_order or 100.0)
        else:
            if not request.selection_uuid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"selection_uuid is required when level is '{request.level}'."
                )
            
            product = db.query(Product).filter(Product.product_id == request.selection_uuid).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID '{request.selection_uuid}' not found."
                )
            unit_price = float(product.selling_price)
            unit_cost = float(product.cost_price)
            current_inventory = float(product.stock_qty)
            min_order_qty = float(product.min_order_qty)

        unit_margin = unit_price - unit_cost

        # 2. Fetch or generate baseline overall demand forecast using ForecastingService
        forecast_req = ForecastGenerationRequest(
            level=request.level,
            selection_uuid=request.selection_uuid,
            days_to_predict=request.projection_days
        )

        try:
            forecast_run = ForecastingService.get_latest_forecast(db, request.level, request.selection_uuid)
            if not forecast_run or forecast_run.days_forecasted < request.projection_days:
                forecast_run = ForecastingService.generate_and_save_forecast(db, forecast_req)
        except ValueError as val_err:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
                detail=str(val_err)
            )
        except Exception as err:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Forecasting engine execution failed: {str(err)}"
            )

        # Extract baseline predicted daily quantities
        baseline_predictions = np.array([
            val.predicted_quantity for val in forecast_run.values[-request.projection_days:]
        ])

        # 3. Apply Cross Elasticity and Market Multiplier adjustments
        cross_elasticity_coeff = 0.4
        demand_shift_pct = (request.competitor_price_change_pct / 100.0) * cross_elasticity_coeff
        simulated_demand = baseline_predictions * (1.0 + demand_shift_pct) * request.demand_multiplier

        # 4. Monte Carlo Inventory vs. Supply Chain Delays Simulation
        days = request.projection_days
        num_simulations = 100
        stockout_occurred_count = 0
        total_lost_sales_units = 0.0

        for _ in range(num_simulations):
            inv = current_inventory
            sim_lost_units = 0.0
            sim_has_stockout = False
            
            # Stochastic arrival delay variance
            stochastic_delay = request.shipping_delay_days + np.random.randint(-1, 2)

            for d in range(days):
                # Restocking PO cycle every 14 days
                if d > 0 and (d - stochastic_delay) % 14 == 0:
                    inv += max(min_order_qty * 50, 1000)

                daily_req = simulated_demand[d]
                if inv >= daily_req:
                    inv -= daily_req
                else:
                    sim_lost_units += (daily_req - inv)
                    inv = 0.0
                    sim_has_stockout = True

            if sim_has_stockout:
                stockout_occurred_count += 1
            total_lost_sales_units += sim_lost_units

        # 5. Financial & CSAT KPI summaries
        avg_lost_units = total_lost_sales_units / num_simulations
        stockout_probability = (stockout_occurred_count / num_simulations) * 100.0
        profit_risk = -1.0 * (avg_lost_units * unit_margin)

        baseline_total_revenue = np.sum(baseline_predictions) * unit_price
        simulated_realized_revenue = (np.sum(simulated_demand) - avg_lost_units) * unit_price
        revenue_impact = simulated_realized_revenue - baseline_total_revenue

        delay_penalty = request.shipping_delay_days * 2.5
        stockout_penalty = (stockout_probability / 100.0) * 12.0
        csat_score = max(0.0, min(100.0, 95.0 - delay_penalty - stockout_penalty))

        summary = (
            f"With {request.shipping_delay_days} additional delay days, "
            f"{request.competitor_price_change_pct:+.0f}% competitor pricing, "
            f"and {request.demand_multiplier}x market demand."
        )

        return SimulationResponseData(
            level=request.level,
            selection_uuid=request.selection_uuid,
            projected_profit_risk=round(profit_risk, 2),
            revenue_impact=round(revenue_impact, 2),
            stockout_risk_percentage=round(stockout_probability, 1),
            customer_satisfaction_index=round(csat_score, 1),
            scenario_summary=summary
        )
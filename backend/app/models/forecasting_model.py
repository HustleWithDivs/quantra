from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class ForecastRun(Base):
    __tablename__ = "forecast_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    level: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Corrected to use UUID matching your corporate product keys
    selection_uuid: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    model_version: Mapped[str] = mapped_column(String(50), default="xgboost_v1.0")
    days_forecasted: Mapped[int] = mapped_column(Integer, default=15)

    values: Mapped[List["ForecastValue"]] = relationship(
        "ForecastValue", back_populates="run", cascade="all, delete-orphan", lazy="selectin"
    )

class ForecastValue(Base):
    __tablename__ = "forecast_values"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_id: Mapped[int] = mapped_column(Integer, ForeignKey("forecast_runs.id", ondelete="CASCADE"), nullable=False)
    forecast_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    predicted_quantity: Mapped[float] = mapped_column(Float, nullable=False)

    run: Mapped["ForecastRun"] = relationship("ForecastRun", back_populates="values")
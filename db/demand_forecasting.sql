DROP TABLE IF EXISTS forecast_values CASCADE;
DROP TABLE IF EXISTS forecast_runs CASCADE;

CREATE TABLE forecast_runs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    level VARCHAR(50) NOT NULL,
    selection_uuid UUID NULL,
    model_version VARCHAR(50) NOT NULL DEFAULT 'xgboost_v1.0',
    days_forecasted INTEGER NOT NULL DEFAULT 15
);

CREATE INDEX idx_forecast_runs_uuid_lookup ON forecast_runs(level, selection_uuid, created_at DESC);

CREATE TABLE forecast_values (
    id SERIAL PRIMARY KEY,
    run_id INTEGER NOT NULL,
    forecast_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    predicted_quantity DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_forecast_run FOREIGN KEY(run_id) REFERENCES forecast_runs(id) ON DELETE CASCADE
);

CREATE INDEX idx_forecast_values_run_date ON forecast_values(run_id, forecast_date);
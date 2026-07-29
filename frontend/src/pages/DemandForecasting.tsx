import React from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useDemandForecasting } from '../hooks/forecasting/useDemandForecasting';

export const DemandForecasting: React.FC = () => {
  const {
    level,
    setLevel,
    selectionUuid,
    setSelectionUuid,
    options,
    loadingOptions,
    data,
    loading,
    generating,
    handleGenerateForecast,
  } = useDemandForecasting();

  const metrics = data?.metrics;
  const chartPoints = data?.chart_points || [];
  const transitionPoint = chartPoints.find((p) => p.is_forecast);

  return (
    <Container fluid className="py-4 px-4  min-vh-100">
      {/* Title Header & Multi-Level Controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Sales Forecasting</h2>
          <p className="text-muted small mb-0">
            AI-powered demand predictions based on historical data and market signals
          </p>
        </div>

        {/* Level & Target Entity Filters */}
        <div className="d-flex align-items-center gap-2">
          <Form.Group style={{ minWidth: 160 }}>
            <Form.Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="form-select-sm shadow-sm"
            >
              <option value="overall">Overall Level</option>
              <option value="brand">Brand Level</option>
              <option value="category">Category Level</option>
              <option value="subcategory">Subcategory Level</option>
              <option value="product">Product Level</option>
            </Form.Select>
          </Form.Group>

          {level !== 'overall' && (
            <Form.Group style={{ minWidth: 200 }}>
              <Form.Select
                value={selectionUuid}
                onChange={(e) => setSelectionUuid(e.target.value)}
                disabled={loadingOptions || options.length === 0}
                className="form-select-sm shadow-sm"
              >
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Button
            variant="dark"
            size="sm"
            onClick={handleGenerateForecast}
            disabled={generating}
            className="px-3"
          >
            {generating ? <Spinner size="sm" animation="border" /> : 'Run Forecast'}
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <span className="text-muted fs-7 d-block mb-1">Predicted Peak Month</span>
              <h3 className="fw-bold  mb-1">{metrics?.predicted_peak_month || 'N/A'}</h3>
              <span className="text-muted fs-7">{metrics?.predicted_peak_growth}</span>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <span className="text-muted fs-7 d-block mb-1">Avg Monthly Growth</span>
              <h3 className="fw-bold  mb-1">{metrics?.avg_monthly_growth || '0%'}</h3>
              <span className="text-muted fs-7">Based on historical trend</span>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <span className="text-muted fs-7 d-block mb-1">Confidence Interval</span>
              <h3 className="fw-bold  mb-1">{metrics?.confidence_interval || '±0%'}</h3>
              <span className="text-muted fs-7">95% confidence level</span>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <span className="text-muted fs-7 d-block mb-1">Seasonality Factor</span>
              <h3 className="fw-bold  mb-1">{metrics?.seasonality_factor || '1.0x'}</h3>
              <span className="text-muted fs-7">Seasonal variance applied</span>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Chart Card */}
      <Card className="border-0 shadow-sm rounded-3 p-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">
                Historical Volume & 90-Day Forecast ({level.toUpperCase()})
              </h4>
              <p className="text-muted small mb-0">
                Units sold per month with predictive trend projection
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 fs-7 text-secondary">
                <span className="rounded-circle bg-dark d-inline-block" style={{ width: 8, height: 8 }}></span>
                Historical
              </div>
              <div className="d-flex align-items-center gap-2 fs-7 text-secondary">
                <span className="border-top border-dark border-2 d-inline-block" style={{ width: 16 }}></span>
                Forecast
              </div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div style={{ width: '100%', height: 380 }}>
              <ResponsiveContainer>
                <LineChart data={chartPoints} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date_label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `${val >= 1000 ? val / 1000 + 'k' : val}`}
                  />
                  <Tooltip />

                  {transitionPoint && (
                    <ReferenceLine
                      x={transitionPoint.date_label}
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      label={{ value: 'Today', position: 'top', fill: '#64748b', fontSize: 11 }}
                    />
                  )}

                  <Line type="monotone" dataKey="actual_quantity" stroke="#5f6061" strokeWidth={2} dot={false} name="Historical" connectNulls={false} />
                  <Line type="monotone" dataKey="forecast_quantity" stroke="#809ad8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
            <span className="text-muted fs-7">
              Model: XGBoost ensemble | Target Level: {level.toUpperCase()}
            </span>
            <Button variant="primary" className="px-3 py-2 fs-7 fw-medium rounded-2">
              Export Forecast Report
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DemandForecasting;
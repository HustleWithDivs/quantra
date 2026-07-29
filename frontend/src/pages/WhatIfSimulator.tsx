import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { BiRotateLeft, BiSolidTruck, BiDollarCircle, BiTrendingUp, BiErrorCircle } from 'react-icons/bi';
import { useSimulator } from '../hooks/simulator/useSimulator';
import { QuantraButton } from '../components/reusable/QuantraButton';
import { QuantraSlider } from '../components/reusable/QuantraSlider';

export const WhatIfSimulator: React.FC = () => {
  const {
    shippingDelayDays,
    setShippingDelayDays,
    competitorPriceChangePct,
    setCompetitorPriceChangePct,
    demandMultiplier,
    setDemandMultiplier,
    simulationData,
    isLoading,
    handleReset,
  } = useSimulator();

  return (
    <Container fluid className="py-4 px-4 min-vh-100">
      {/* Page Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-1 fw-bold">What-If Simulator</h3>
          <p className="text-muted mb-0 small">
            Model business disruptions and see projected financial impacts in real-time
          </p>
        </Col>
        <Col xs="auto">
          <QuantraButton
            variant="outline-secondary"
            icon={<BiRotateLeft className="fs-5" />}
            onClick={handleReset}
            text="Reset Simulation"
          />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Left Column: Interactive Simulation Control Cards */}
        <Col lg={6}>
          <div className="d-flex flex-column gap-3">
            {/* 1. Shipping Delays Card */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-warning-subtle text-warning p-2 rounded-3 d-flex align-items-center justify-content-center">
                    <BiSolidTruck className="fs-3" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Shipping Delays</h5>
                    <span className="text-muted small">Simulate supply chain disruptions</span>
                  </div>
                </div>

                <QuantraSlider
                  label="Additional delay days"
                  value={shippingDelayDays}
                  min={0}
                  max={14}
                  unit=" days"
                  minLabel="0 days"
                  maxLabel="14 days"
                  onChange={setShippingDelayDays}
                />
              </Card.Body>
            </Card>

            {/* 2. Competitor Price Adjustments Card */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success-subtle text-success p-2 rounded-3 d-flex align-items-center justify-content-center">
                    <BiDollarCircle className="fs-3" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Competitor Price Adjustments</h5>
                    <span className="text-muted small">Model market price changes</span>
                  </div>
                </div>

                <QuantraSlider
                  label="Price change percentage"
                  value={competitorPriceChangePct}
                  min={-20}
                  max={20}
                  unit="%"
                  minLabel="-20%"
                  maxLabel="+20%"
                  onChange={setCompetitorPriceChangePct}
                />
              </Card.Body>
            </Card>

            {/* 3. Market Trend Multiplier Card */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center">
                    <BiTrendingUp className="fs-3" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Market Trend Multiplier</h5>
                    <span className="text-muted small">Adjust demand growth expectations</span>
                  </div>
                </div>

                <QuantraSlider
                  label="Demand multiplier"
                  value={demandMultiplier}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  unit="x"
                  minLabel="0.5x (Decline)"
                  maxLabel="2.0x (Boom)"
                  onChange={setDemandMultiplier}
                />
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* Right Column: Projected Impact Analytics Dashboard */}
        <Col lg={6}>
          <div className="d-flex flex-column gap-3">
            {/* Primary KPI Card: Projected Profit Risk */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <BiErrorCircle className="text-danger fs-5" />
                  <span className="text-uppercase text-secondary fw-bold fs-7">
                    PROJECTED PROFIT RISK
                  </span>
                </div>
                <h1 className="display-5 fw-bold text-danger mb-1">
                  ${simulationData?.projected_profit_risk ? simulationData.projected_profit_risk.toLocaleString() : '0'}
                </h1>
                <span className="text-muted small">
                  Based on current simulation parameters over 90-day projection
                </span>
              </Card.Body>
            </Card>

            {/* Sub-KPI Grid */}
            <Row className="g-3">
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
                  <Card.Body className="p-2">
                    <span className="text-secondary small fw-medium d-block mb-1">Revenue Impact</span>
                    <h3 className="fw-bold text-success mb-1">
                      {simulationData?.revenue_impact && simulationData.revenue_impact > 0 ? '+' : ''}
                      ${simulationData?.revenue_impact ? simulationData.revenue_impact.toLocaleString() : '0'}
                    </h3>
                    <span className="text-muted fs-7">Projected change in revenue</span>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
                  <Card.Body className="p-2">
                    <span className="text-secondary small fw-medium d-block mb-1">Stockout Risk</span>
                    <h3 className="fw-bold text-warning mb-1">
                      {simulationData?.stockout_risk_percentage ?? 0}%
                    </h3>
                    <span className="text-muted fs-7">Probability of inventory shortage</span>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Customer Satisfaction Index Card */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <span className="text-secondary small fw-medium d-block mb-1">
                  Customer Satisfaction Index
                </span>
                <h3 className="fw-bold text-dark mb-2">
                  {simulationData?.customer_satisfaction_index ?? 0}%
                </h3>
                <ProgressBar
                  now={simulationData?.customer_satisfaction_index ?? 0}
                  variant="warning"
                  style={{ height: '8px' }}
                  className="rounded-pill mb-2"
                />
                <span className="text-muted fs-7">
                  Estimated impact on delivery experience and service levels
                </span>
              </Card.Body>
            </Card>

            {/* Scenario Summary Card */}
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <Card.Body>
                <h5 className="fw-bold text-dark mb-2">Scenario Summary</h5>
                <p className="text-secondary mb-0 small">
                  {simulationData?.scenario_summary ||
                    `With ${shippingDelayDays} additional delay days, ${
                      competitorPriceChangePct >= 0 ? '+' : ''
                    }${competitorPriceChangePct}% competitor pricing, and ${demandMultiplier}x market demand.`}
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WhatIfSimulator;
import React from 'react';
import { Container, Row, Col, Card, Form, Spinner } from 'react-bootstrap';
import { BiTrendingUp } from 'react-icons/bi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDemandForecasting, LevelOptions, HorizonOptions } from '../hooks/forecasting/useDemandForecasting';
import { QuantraSelectField } from '../components/reusable/QuantraSelectField';
import { QuantraButton } from '../components/reusable/QuantraButton';

const DemandForecasting: React.FC = () => {
  const {
    handleSubmit,
    control,
    watchLevel,
    dynamicOptions,
    chartData,
    isLoading,
    isGenerating,
    handleExecuteForecast
  } = useDemandForecasting();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Branding Bar */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiTrendingUp className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Demand Forecasting Engine</h4>
          </div>
        </Col>
      </Row>

      {/* Control Parameters Workspace */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="bg-light rounded p-4">
          <Form onSubmit={handleSubmit(handleExecuteForecast)}>
            <Row className="align-items-end">
              {/* Dropdown 1: Target Structural Scale Options */}
              <Col md={3}>
                <QuantraSelectField
                  label="Target Horizon Scope"
                  name="level"
                  options={LevelOptions}
                  control={control}
                  placeholder="Choose Contextual Scope..."
                />
              </Col>

              {/* Dropdown 2: Dynamic Listing Selector */}
              <Col md={4}>
                <QuantraSelectField
                  label="Entity Target Instance"
                  name="selection_uuid"
                  options={dynamicOptions}
                  control={control}
                  disabled={watchLevel === 'overall' || isLoading}
                  placeholder={
                    watchLevel === 'overall' 
                      ? "Unused for Global System Context" 
                      : isLoading 
                        ? "Fetching listing entities..." 
                        : "Select Specific Target Entity..."
                  }
                />
              </Col>

              {/* Dropdown 3: Horizon Steps Matrix */}
              <Col md={3}>
                <QuantraSelectField
                  label="Forecast Step Horizon"
                  name="horizon"
                  options={HorizonOptions}
                  control={control}
                  placeholder="Select Prediction Window..."
                />
              </Col>

              {/* Submission Pipeline Trigger */}
              <Col md={2}>
                <QuantraButton
                  variant="primary"
                  type="submit"
                  className="w-100  mb-3 mt-md-0"
                  isLoading={isGenerating}
                  text="Run Engine"
                />
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Visual Analytics Representation Frame */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 fw-semibold text-secondary">
          Time-Series Trend Output Matrix
        </Card.Header>
        <Card.Body style={{ minHeight: '400px' }} className="d-flex align-items-center justify-content-center">
          {isGenerating ? (
            <div className="d-flex flex-column align-items-center">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <span className="text-muted small fw-medium">Processing recursive statistical models...</span>
            </div>
          ) : chartData.length > 0 ? (
            <div className="w-100 h-100" style={{ minHeight: '380px' }}>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="forecast_date" 
                    tick={{ fill: '#6c757d', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6c757d', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    label={{ value: 'Predicted Quantity', angle: -90, position: 'insideLeft', offset: 0, fill: '#495057' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line
                    name="Quantity"
                    type="monotone"
                    dataKey="predicted_quantity"
                    stroke="#0d6efd"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted p-5">
              <BiTrendingUp className="fs-1 text-black-50 mb-3" />
              <p className="mb-0">Configure workspace scopes above and run calculations to see data charts.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DemandForecasting;
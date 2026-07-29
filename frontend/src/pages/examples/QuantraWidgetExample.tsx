import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { BiCube, BiTrendingUp, BiCircle, BiDotsVerticalRounded } from 'react-icons/bi';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraWidget } from '../../components/reusable/QuantraWidget';

export default function WidgetWorkspace() {
  const [fetchingMetrics, setFetchingMetrics] = useState(false);

  const simulateMetricsRefreshLoop = () => {
    setFetchingMetrics(true);
    setTimeout(() => setFetchingMetrics(false), 2000);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold large-display mb-1">Operational Analytics</h4>
          <p className="text-muted small mb-0">Live structural grid reporting matrix layout elements</p>
        </div>
        
        {/* Trigger component refreshing states directly */}
        <QuantraButton
          variant="outline-primary"
          text="Sync Telemetry Mesh"
          isLoading={fetchingMetrics}
          onClick={simulateMetricsRefreshLoop}
        />
      </div>

      <Row className="g-4">
        {/* Widget 1: Primary Numeric Data Matrix */}
        <Col xs={12} md={6} lg={4}>
          <QuantraWidget
            title="Total Processing Throughput"
            value="4,829,104"
            icon={<BiCube className="fs-3 text-primary" />}
            trendLabel="+12.4% vs baseline"
            trendDirection="up"
            trendVariant="success"
            isLoading={fetchingMetrics}
            footerText="Updated 2m ago"
            headerActions={
              <QuantraButton variant="link" className="text-muted p-0 border-0" icon={<BiDotsVerticalRounded className="fs-5" />} />
            }
          />
        </Col>

        {/* Widget 2: Warning State Alert Matrix */}
        <Col xs={12} md={6} lg={4}>
          <QuantraWidget
            title="Network Packet Latency Drop"
            value="34.82 ms"
            icon={<BiTrendingUp className="fs-3 text-warning" />}
            trendLabel="-4.1% degradation"
            trendDirection="down"
            trendVariant="danger"
            isLoading={fetchingMetrics}
            footerText="Cluster: US-EAST"
          />
        </Col>

        {/* Widget 3: Loading Mode State Verification */}
        <Col xs={12} md={6} lg={4}>
          <QuantraWidget
            title="Asynchronous Background Telemetry Engine"
            value="Running Standard"
            icon={<BiCircle className="fs-3 text-success animate-pulse" />}
            isLoading={fetchingMetrics}
          />
        </Col>
      </Row>
    </Container>
  );
}

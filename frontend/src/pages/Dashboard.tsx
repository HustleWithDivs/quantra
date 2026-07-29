import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  BiTrendingUp,
  BiBarChartAlt2,
  BiCheckShield,
  BiCalendar,
  BiDollarCircle,
  BiPackage,
  BiCube,
  BiBoltCircle,
  BiRefresh,
  BiLink,
  BiErrorAlt,
} from 'react-icons/bi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useDashboard } from '../hooks/dashboard/useDashboard';

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <Spinner animation="border" variant="primary" className="mb-2" />
        <span className="text-muted small">Loading Dashboard Metrics...</span>
      </div>
    );
  }

  // Extract nested metric objects safely from API payload
  const peakMonth = data?.predicted_peak_month;
  const avgGrowth = data?.avg_monthly_growth;
  const confInterval = data?.confidence_interval;
  const seasonality = data?.seasonality_factor;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <BiBoltCircle className="text-primary fs-5" />;
      case 'success':
        return <BiRefresh className="text-success fs-5" />;
      case 'link':
        return <BiLink className="text-primary fs-5" />;
      case 'warning':
        return <BiErrorAlt className="text-warning fs-5" />;
      default:
        return <BiBoltCircle className="text-primary fs-5" />;
    }
  };

  return (
    <Container fluid className="py-4 px-4 min-vh-100">
      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold  mb-1">Good morning. Here is your inventory health today.</h2>
          <span className="text-muted small">
            Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Primary Forecast Metrics Row (Returned from Database API) */}
      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-medium">{peakMonth?.title || 'Predicted Peak Month'}</span>
                <BiCalendar className="fs-4 text-primary" />
              </div>
              <div className="d-flex justify-content-between align-items-baseline">
                <h3 className="fw-bold  mb-0">{peakMonth?.value || 'N/A'}</h3>
                <span className="small fw-bold text-success">{peakMonth?.subtext}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-medium">{avgGrowth?.title || 'Avg Monthly Growth'}</span>
                <BiTrendingUp className="fs-4 text-primary" />
              </div>
              <div className="d-flex justify-content-between align-items-baseline">
                <h3 className="fw-bold  mb-0">{avgGrowth?.value || '0.0%'}</h3>
                <span className="small text-muted fs-7">{avgGrowth?.subtext}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-medium">{confInterval?.title || 'Confidence Interval'}</span>
                <BiCheckShield className="fs-4 text-primary" />
              </div>
              <div className="d-flex justify-content-between align-items-baseline">
                <h3 className="fw-bold  mb-0">{confInterval?.value || '±0.0%'}</h3>
                <span className="small text-muted fs-7">{confInterval?.subtext}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-medium">{seasonality?.title || 'Seasonality Factor'}</span>
                <BiBarChartAlt2 className="fs-4 text-primary" />
              </div>
              <div className="d-flex justify-content-between align-items-baseline">
                <h3 className="fw-bold  mb-0">{seasonality?.value || '1.00x'}</h3>
                <span className="small text-muted fs-7">{seasonality?.subtext}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 30-Day Database Totals Banner */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-light-primary rounded-3">
                <BiDollarCircle className="fs-3 text-primary" />
              </div>
              <div>
                <span className="text-muted fs-7 d-block">30-Day Total Revenue</span>
                <h4 className="fw-bold mb-0">${data?.total_revenue_30d?.toLocaleString() ?? 0}</h4>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-light-success rounded-3">
                <BiPackage className="fs-3 text-success" />
              </div>
              <div>
                <span className="text-muted fs-7 d-block">30-Day Units Sold</span>
                <h4 className="fw-bold mb-0">{data?.total_units_sold_30d?.toLocaleString() ?? 0}</h4>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-light-info rounded-3">
                <BiCube className="fs-3 text-info" />
              </div>
              <div>
                <span className="text-muted fs-7 d-block">Active Linked Products</span>
                <h4 className="fw-bold mb-0">{data?.active_products_count ?? 0}</h4>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Dashboard Content */}
      <Row className="g-4">
        {/* Sales Volume & Forecast Chart Card */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-2">
              <h4 className="fw-bold text-dark mb-1">Sales Volume & 90-Day Forecast</h4>
              <p className="text-muted small mb-4">Historical consumption with predictive trend line</p>

              <div style={{ width: '100%', height: 320 }}>
                <div style={{ width: '100%', height: 320 }}>
  <ResponsiveContainer>
    <AreaChart data={data?.chart_data || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="date_label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#64748b', fontSize: 12 }}
        tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
      />
      <Tooltip />
      {/* Historical Sales Line */}
      <Area
        type="monotone"
        dataKey="actual_quantity"
        stroke="#2563eb"
        strokeWidth={2.5}
        fillOpacity={1}
        fill="url(#colorQty)"
        name="Historical Sales"
        connectNulls
      />
      {/* 90-Day Forecast Line */}
      <Area
        type="monotone"
        dataKey="forecast_quantity"
        stroke="#0284c7"
        strokeWidth={2}
        strokeDasharray="4 4"
        fillOpacity={0}
        name="90-Day Forecast"
        connectNulls
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Smart Notifications Sidebar Card */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-3 p-3 h-100">
            <Card.Body className="p-2">
              <h4 className="fw-bold text-dark mb-1">Smart Notifications</h4>
              <p className="text-muted small mb-3">Recent automated system activities</p>

              <div className="d-flex flex-column">
                {(data?.notifications || []).map((item: any) => (
                  <div key={item.id} className="py-3 border-bottom d-flex gap-3 align-items-start">
                    <div className="mt-1">{getNotificationIcon(item.type)}</div>
                    <div>
                      <p className="mb-0 fw-medium text-dark small">{item.message}</p>
                      <span className="text-muted fs-7">{item.timestamp_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
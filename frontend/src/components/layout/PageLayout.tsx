import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Topbar from './Topbar';
import Sidebar from './Sidebar';


// 1. Lazy load your components right here inside the layout module
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MasterData = lazy(() => import('../pages/MasterData'));
const ProductData = lazy(() => import('../pages/ProductData'));
const Customer = lazy(() => import('../pages/Customer'));
const UserManagement = lazy(() => import('../pages/UserManagement'));

// Centralized UI loading indicator fallback
const PageLoader =() =>(
  <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '50vh' }}>
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

function PageLayout({theme,setTheme}) {
  return (
    <Container  fluid className="d-flex min-vh-100">
      {/* Structural Global Components */}
      <Topbar theme={theme} setTheme={setTheme} />
                {/* Static Sidebar Panel Column */}

        
        <Row className="d-flex flex-col">
          
          <Col xs={3} md={3} lg={2} className="p-1 position-sticky" style={{ top: '56px', width:'240px', padding:0 }}>
            <Sidebar />
          </Col>

          {/* Dynamic Content Switching Workspace Area */}
          <Col xs={9} md={9} lg={10} className="p-1 overflow-auto" style={{ height: 'calc(100vh - 56px)' }}>
            
            {/* 2. Embedded Router Configuration wrapped in Suspense */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Fallback baseline routing index rules */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                
                {/* Dashboard view mappings */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="master-data" element={<MasterData />} />
                <Route path="product-data" element={<ProductData />} />
                <Route path="customer" element={<Customer />} />
                <Route path="user-management" element={<UserManagement />} />

                {/* Optional Catch-all wildcard redirect handler */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

          </Col>

        </Row>
    </Container>
  );
}

export default PageLayout;

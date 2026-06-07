import React, { lazy, Suspense,useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Topbar from './Topbar';
import Sidebar from './Sidebar';


// 1. Lazy load your components right here inside the layout module
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const MasterData = lazy(() => import('../../pages/MasterData'));
const ProductData = lazy(() => import('../../pages/ProductData'));
const Customer = lazy(() => import('../../pages/Customer'));
const UserManagement = lazy(() => import('../../pages/UserManagement'));
const QuantraButtonExample = lazy(()=>import('../../pages/examples/QuantraButtonExample'))
const QuantraInputFieldExample = lazy(()=>import('../../pages/examples/QuantraInputFieldExample'))
const QuantraTableExample = lazy(()=>import('../../pages/examples/QuantraTableExample'))
const QuantraModalExample = lazy(()=>import('../../pages/examples/QuantraModalExample'))
const QuantraWidgetExample = lazy(()=>import('../../pages/examples/QuantraWidgetExample'))

// Centralized UI loading indicator fallback
const PageLoader =() =>(
   
  <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '50vh' }}>
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

const PageLayout=({theme,setTheme}) =>{
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  return (
    <Container fluid className="p-0 min-vh-100 d-flex flex-column overflow-hidden">
      <div className="d-flex flex-grow-1">
        {/* Dynamic Width Sidebar Panel */}
        <Sidebar isExpanded={isSidebarExpanded} />

        {/* Primary Workspace Engine Container */}
        <div className="d-flex flex-column flex-grow-1 min-vh-100 overflow-hidden">
          <Topbar 
            theme={theme} 
            setTheme={setTheme} 
            onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
          />

          {/* Dynamic Route Display Canvas Area */}
          <main className="flex-grow-1 p-4 overflow-auto" style={{ height: 'calc(100vh - 57px)' }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/master-data" element={<MasterData />} />
                <Route path="/product-data" element={<ProductData />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/button-example" element={<QuantraButtonExample />} />
                <Route path="/input-example" element={<QuantraInputFieldExample />} />
                <Route path="/table-example" element={<QuantraTableExample />} />
                <Route path="/modal-example" element={<QuantraModalExample />} />
                <Route path="/widget-example" element={<QuantraWidgetExample />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Container>
    
  );
}

export default PageLayout;

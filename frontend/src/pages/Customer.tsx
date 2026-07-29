import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiGroup } from 'react-icons/bi';
import { useCustomers } from '../hooks/customer/useCustomers';
import { QuantraTable } from '../components/reusable/QuantraTable';
import { CustomerOrdersDrawer } from '../components/customers/CustomerOrdersDrawer';

export const Customers: React.FC = () => {
  const {
    customers,
    totalItems,
    isLoading,
    tableController,
    columns,
    selectedCustomer,
    isDrawerOpen,
    handleCloseOrdersDrawer,
  } = useCustomers();

  return (
    <Container fluid className="py-4 px-4">
      {/* Title Header Section */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiGroup className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Customer Directory</h4>
          </div>
        </Col>
      </Row>

      {/* Main Customers Table */}
      <QuantraTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search Customer by Name or Phone"
        tableController={tableController}
      />

      {/* Offcanvas Orders Drawer */}
      <CustomerOrdersDrawer
        show={isDrawerOpen}
        onClose={handleCloseOrdersDrawer}
        customer={selectedCustomer}
      />
    </Container>
  );
};

export default Customers;
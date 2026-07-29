import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Offcanvas, Badge, Accordion, Table } from 'react-bootstrap';
import { BiReceipt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { customerApi, type Customer, type CustomerOrder } from '../../api/customerApi';
import { QuantraTable, type TableColumn } from '../reusable/QuantraTable';

interface CustomerOrdersDrawerProps {
  show: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const ORDERS_PER_PAGE = 5;

export const CustomerOrdersDrawer: React.FC<CustomerOrdersDrawerProps> = ({
  show,
  onClose,
  customer,
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('invoice_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchOrders = useCallback(async () => {
    if (!customer?.customer_id) return;
    setIsLoading(true);
    try {
      const res = await customerApi.getCustomerOrders(customer.customer_id);
      if (res.requestStatus) {
        setOrders(res.data || []);
      } else {
        toast.error(res.message || 'Failed to load orders for selected customer.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error retrieving customer order history.');
    } finally {
      setIsLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (show && customer) {
      setCurrentPage(1);
      setSearchTerm('');
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [show, customer, fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((o) => o.invoice_number?.toLowerCase().includes(term));
  }, [orders, searchTerm]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ORDERS_PER_PAGE) || 1;

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }, [totalPages]);

  const tableController = {
    currentPage,
    searchTerm,
    sortKey,
    sortDirection,
    totalPages,
    paginationRange,
    handleSearchChange: (query: string) => {
      setSearchTerm(query);
      setCurrentPage(1);
    },
    handleSortChange: (key: string) => {
      const isAsc = sortKey === key && sortDirection === 'asc';
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortKey(key);
    },
    handlePageChange: (pageNumber: number) => {
      setCurrentPage(pageNumber);
    },
  };

  const orderColumns: TableColumn<CustomerOrder>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice #',
      sortable: true,
      render: (row) => <span className="fw-bold text-primary">{row.invoice_number}</span>,
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold">
          {row.currency} {row.total_amount?.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          bg={
            row.status?.toLowerCase() === 'completed'
              ? 'success'
              : row.status?.toLowerCase() === 'pending'
              ? 'warning'
              : 'secondary'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: '650px' }}>
      <Offcanvas.Header closeButton className="border-bottom bg-light">
        <Offcanvas.Title className="d-flex align-items-center gap-2">
          <BiReceipt className="fs-3 text-primary" />
          <div>
            <h5 className="mb-0 fw-bold">
              {customer ? `${customer.first_name} ${customer.last_name}` : 'Customer Orders'}
            </h5>
            <span className="text-muted fs-7">{customer?.email || 'No email registered'}</span>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-3">
        {/* Orders Table with Pagination */}
        <QuantraTable
          columns={orderColumns}
          data={paginatedOrders}
          isLoading={isLoading}
          totalItems={totalItems}
          searchPlaceholder="Search Invoice #"
          tableController={tableController}
        />

        {/* Detailed Expandable Order Line Items View */}
        {!isLoading && orders.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold mb-3 text-secondary">Order History Line Items</h6>
            <Accordion defaultActiveKey="0" flush>
              {paginatedOrders.map((order, idx) => (
                <Accordion.Item key={order.order_id} eventKey={idx.toString()} className="border mb-2 rounded">
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100 me-3">
                      <span className="fw-bold">{order.invoice_number}</span>
                      <span className="text-primary fw-semibold">
                        {order.currency} {order.total_amount?.toFixed(2)}
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="bg-light p-2">
                    <Table responsive size="sm" className="mb-0 bg-white border rounded">
                      <thead className="table-light">
                        <tr>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Sales Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.history_items && order.history_items.length > 0 ? (
                          order.history_items.map((item, itemIdx) => (
                            <tr key={itemIdx}>
                              <td>{item.quantity}</td>
                              <td>{item.price?.toFixed(2)}</td>
                              <td>{item.sales_price?.toFixed(2)}</td>
                              <td className="fw-semibold">{item.total?.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted fs-7 py-2">
                              No history details attached to this order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
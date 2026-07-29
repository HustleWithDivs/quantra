import React from 'react';
import { BiShow } from 'react-icons/bi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';
import { type Customer } from '../api/customerApi';

interface CustomerColumnsConfig {
  onViewOrders: (customer: Customer) => void;
}

export const getCustomerTableColumns = ({
  onViewOrders,
}: CustomerColumnsConfig): TableColumn<Customer>[] => [
  {
    key: 'first_name',
    header: 'Customer',
    sortable: true,
    render: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-semibold text-primary">{`${row.first_name} ${row.last_name}`}</span>
        <span className="text-muted small">{row.email || 'N/A'}</span>
      </div>
    ),
  },
  {
    key: 'telephone',
    header: 'Telephone',
    sortable: false,
    render: (row) => <span className="text-secondary small">{row.telephone || 'N/A'}</span>,
  },
  {
    key: 'city',
    header: 'Location',
    sortable: false,
    render: (row) => (
      <span className="text-secondary small">
        {[row.city, row.country].filter(Boolean).join(', ') || 'N/A'}
      </span>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    sortable: true,
    render: (row) => (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-2">
        {row.source}
      </span>
    ),
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span
        className={`badge px-2 py-1 rounded-pill ${
          row.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
        }`}
      >
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'table_action_controls',
    header: 'Actions',
    sortable: false,
    render: (row) => (
      <QuantraButton
        variant="outline-primary"
        size="sm"
        icon={<BiShow className="fs-5" />}
        text="View Orders"
        onClick={() => onViewOrders(row)}
      />
    ),
  },
];
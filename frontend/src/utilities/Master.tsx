import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { type Brand } from '../api/brandApi';
import { type Material } from '../api/materialApi';
import { type Supplier } from '../api/supplierApi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';


interface BrandColumnsConfig {
  onEdit: (role: Brand) => void;
  onDelete: (role: Brand) => void;
}

interface SupplierColumnsConfig {
  onEdit: (role: Supplier) => void;
  onDelete: (role: Supplier) => void;
}

interface MaterialColumnsConfig {
  onEdit: (role: Material) => void;
  onDelete: (role: Material) => void;
}

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
 * Brand
 */
export const getBrandTableColumns = ({ onEdit, onDelete }: BrandColumnsConfig): TableColumn<Brand>[] => [
  {
    key: 'brand_name',
    header: 'Name',
    sortable: true,
    render: (row) => <span className="fw-semibold text-primary">{row.brand_name || ''}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    sortable: false,
    render: (row) => <span className="text-secondary small">{row.description || ''}</span>,
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span className={`badge px-2 py-1 rounded-pill ${row.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
        {row.is_active ? 'Active' : 'Disabled'}
      </span>
    ),
  },
  {
    key: 'table_action_controls', 
    header: 'Actions',
    sortable: false,
    render: (row) => (
      <div className="d-flex gap-2">
        <QuantraButton
          variant="outline-secondary"
          size="sm"
          icon={<BiEditAlt />}
          onClick={() => onEdit(row)}
        />
        <QuantraButton
          variant="outline-danger"
          size="sm"
          icon={<BiTrash />}
          onClick={() => onDelete(row)}
        />
      </div>
    ),
  },
];

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
 * Supplier
 */
export const getSupplierTableColumns = ({ onEdit, onDelete }: SupplierColumnsConfig): TableColumn<Supplier>[] => [
 
  {
  key: 'supplier_code',
  header: 'Supplier Code',
  sortable: true,
  render: (row) => (
    <span className="fw-semibold text-primary">
      {row.supplier_code || ''}
    </span>
  ),
},
{
  key: 'supplier_name',
  header: 'Supplier Name',
  sortable: true,
  render: (row) => (
    <span className="text-secondary">
      {row.supplier_name || ''}
    </span>
  ),
},
{
  key: 'contact_person',
  header: 'Contact Person',
  sortable: true,
  render: (row) => (
    <span>{row.contact_person || '-'}</span>
  ),
},
{
  key: 'email',
  header: 'Email',
  sortable: true,
  render: (row) => (
    <span className="text-muted small">
      {row.email || '-'}
    </span>
  ),
},
{
  key: 'phone',
  header: 'Phone',
  sortable: false,
  render: (row) => (
    <span>{row.phone || '-'}</span>
  ),
},
{
  key: 'address',
  header: 'Address',
  sortable: false,
  render: (row) => (
    <span className="text-muted small">
      {row.address || '-'}
    </span>
  ),
},
{
  key: 'city',
  header: 'City',
  sortable: true,
  render: (row) => (
    <span>{row.city || '-'}</span>
  ),
},
{
  key: 'state',
  header: 'State',
  sortable: true,
  render: (row) => (
    <span>{row.state || '-'}</span>
  ),
},
{
  key: 'country_id',
  header: 'Country',
  sortable: true,
  render: (row) => (
    <span>{row.country_id ?? '-'}</span>
  ),
},
{
  key: 'gst_number',
  header: 'GST Number',
  sortable: true,
  render: (row) => (
    <span className="font-monospace">
      {row.gst_number || '-'}
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
        row.is_active
          ? 'bg-success-subtle text-success'
          : 'bg-danger-subtle text-danger'
      }`}
    >
      {row.is_active ? 'Active' : 'Disabled'}
    </span>
  ),
},
  {
    key: 'table_action_controls', 
    header: 'Actions',
    sortable: false,
    render: (row) => (
      <div className="d-flex gap-2">
        <QuantraButton
          variant="outline-secondary"
          size="sm"
          icon={<BiEditAlt />}
          onClick={() => onEdit(row)}
        />
        <QuantraButton
          variant="outline-danger"
          size="sm"
          icon={<BiTrash />}
          onClick={() => onDelete(row)}
        />
      </div>
    ),
  },
];

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
 * Material
 */
export const getMaterialTableColumns = ({ onEdit, onDelete }: MaterialColumnsConfig): TableColumn<Material>[] => [
  {
    key: 'material_name',
    header: 'Material Name',
    sortable: true,
    render: (row) => <span className="fw-semibold text-primary">{row.material_name || ''}</span>,
  },
  {
    key: 'material_description',
    header: 'Material Description',
    sortable: false,
    render: (row) => <span className="text-secondary small">{row.material_description || ''}</span>,
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span className={`badge px-2 py-1 rounded-pill ${row.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
        {row.is_active ? 'Active' : 'Disabled'}
      </span>
    ),
  },
  {
    key: 'table_action_controls', 
    header: 'Actions',
    sortable: false,
    render: (row) => (
      <div className="d-flex gap-2">
        <QuantraButton
          variant="outline-secondary"
          size="sm"
          icon={<BiEditAlt />}
          onClick={() => onEdit(row)}
        />
        <QuantraButton
          variant="outline-danger"
          size="sm"
          icon={<BiTrash />}
          onClick={() => onDelete(row)}
        />
      </div>
    ),
  },
];

import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { type Brand } from '../api/brandApi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';


interface BrandColumnsConfig {
  onEdit: (role: Brand) => void;
  onDelete: (role: Brand) => void;
}

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
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

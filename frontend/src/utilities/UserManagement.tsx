import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { type Role } from '../api/roleApi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';
import { type User } from '../api/userApi';
import type { QunatraSelectOption } from '../components/reusable/QuantraSelectField';


interface RoleColumnsConfig {
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
 */
export const getRoleTableColumns = ({ onEdit, onDelete }: RoleColumnsConfig): TableColumn<Role>[] => [
  {
    key: 'role_name',
    header: 'Name',
    sortable: true,
    render: (row) => <span className="fw-semibold text-primary">{row.role_name || ''}</span>,
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
interface UserColumnsConfig {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}
export const getUserTableColumns = ({ onEdit, onDelete }: UserColumnsConfig): TableColumn<User>[] => [
  {
    key: 'full_name',
    header: 'User Profile',
    sortable: true,
    render: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-semibold text-primary">{`${row.first_name} ${row.last_name}`}</span>
        <span className="text-muted small">{row.email}</span>
      </div>
    ),
  },
  {
    key: 'gender',
    header: 'Gender',
    sortable: false,
    render: (row) => <span className="text-secondary text-uppercase small">{row.gender || ''}</span>,
  },
  {
    key: 'roles',
    header: 'Roles',
    sortable: false,
    render: (row) => (
      <div className="d-flex flex-wrap gap-1">
        {row.roles && row.roles.length > 0 ? (
          row.roles.map((roleName, index) => (
            <span key={index} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2">
              {roleName}
            </span>
          ))
        ) : (
          <span className="text-muted fs-7 italic">No Active Roles</span>
        )}
      </div>
    ),
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span className={`badge px-2 py-1 rounded-pill ${row.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
        {row.is_active ? 'Active' : 'Suspended'}
      </span>
    ),
  },
  {
    key: 'table_action_controls',
    header: 'Actions',
    sortable: false,
    render: (row) => (
      <div className="d-flex gap-2">
        <QuantraButton variant="outline-secondary" size="sm" icon={<BiEditAlt />} onClick={() => onEdit(row)} />
        <QuantraButton variant="outline-danger" size="sm" icon={<BiTrash />} onClick={() => onDelete(row)} />
      </div>
    ),
  },
];

export const GenderOptions: QunatraSelectOption[] = [
  { value: 'M', label: 'Male (M)' },
  { value: 'F', label: 'Female (F)' },
  { value: 'O', label: 'Other (O)' }
];
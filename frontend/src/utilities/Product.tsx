import { BiEditAlt, BiTrash, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';
import { type Product } from '../api/productApi';

interface ProductColumnsConfig {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  toggleExpand: (product: Product) => void;
  isExpanded: (product: Product) => boolean;
}

export const getProductTableColumns = ({ onEdit, onDelete, toggleExpand, isExpanded }: ProductColumnsConfig): TableColumn<Product>[] => [
  {
    key: 'expander_control',
    header: '',
    sortable: false,
    render: (row) => (
      <QuantraButton 
        variant="link" 
        size="sm" 
        icon={isExpanded(row) ? <BiChevronUp className="fs-4" /> : <BiChevronDown className="fs-4" />} 
        onClick={() => toggleExpand(row)}
      />
    )
  },
  {
    key: 'sku',
    header: 'SKU Code',
    sortable: true,
    render: (row) => <span className="fw-bold text-dark">{row.sku}</span>,
  },
  {
    key: 'product_name',
    header: 'Product Name',
    sortable: true,
    render: (row) => <span className="fw-semibold text-primary">{row.product_name}</span>,
  },
  {
    key: 'selling_price',
    header: 'Selling Price',
    sortable: true,
    render: (row) => <span>${row.selling_price.toFixed(2)}</span>,
  },
  {
    key: 'stock_qty',
    header: 'Stock Qty',
    sortable: true,
    render: (row) => (
      <span className={`badge px-2 py-1 ${row.stock_qty > 10 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
        {row.stock_qty} units
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
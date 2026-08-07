import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { type TableColumn } from '../components/reusable/QuantraTable';
import { QuantraButton } from '../components/reusable/QuantraButton';

export interface MappingTemplate {
  template_id: string;
  template_name: string;
  column_mapping: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

interface MappingColumnsConfig {
  onEdit: (template: MappingTemplate) => void;
  onDelete: (template: MappingTemplate) => void;
}

/**
 * Static schema factory generating columns definitions for the QuantraTable layout.
 */
export const getMappingTableColumns = ({ onEdit, onDelete }: MappingColumnsConfig): TableColumn<MappingTemplate>[] => [
  {
    key: 'template_name',
    header: 'Template Name',
    sortable: true,
    render: (row) => <span className="fw-semibold text-primary">{row.template_name || ''}</span>,
  },
  {
    key: 'mapped_keys_count',
    header: 'Keys Mapped',
    sortable: false,
    render: (row) => (
      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2">
        {Object.keys(row.column_mapping || {}).length} Fields
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Created At',
    sortable: true,
    render: (row) => <span className="text-secondary small">{new Date(row.created_at).toLocaleDateString()}</span>,
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

export const DB_PRODUCT_TARGET_FIELDS = [
  { value: 'sku', label: 'SKU Identifier Code *' },
  { value: 'product_name', label: 'Product Display Name *' },
  { value: 'upc_ean', label: 'UPC EAN' },
  { value: 'short_description', label: 'Short Description' },
  { value: 'long_description', label: 'Long Description' },
  { value: 'business_category_name', label: 'Business Category Name *' },
  { value: 'department_name', label: 'Department Name *' },
  { value: 'category_name', label: 'Category Name *' },
  { value: 'sub_category_name', label: 'Sub-Category Name *' },
  { value: 'product_type_name', label: 'Product Type *' },
  { value: 'brand_name', label: 'Brand Name *' },
  { value: 'supplier_name', label: 'Supplier Name *' },
  { value: 'material_name', label: 'Material Name *' },
  { value: 'cost_price', label: 'Cost Price *' },
  { value: 'selling_price', label: 'Selling Price *' },
  { value: 'stock_qty', label: 'Stock Qty *' },
  { value: 'color_name', label: 'Color Name' },
  { value: 'size_name', label: 'Size Value' },
  { value: 'barcode', label: 'Barcode' },
  { value: 'min_order_qty', label: 'Min Order Qty' },
  { value: 'weight', label: 'Weight' },
  { value: 'dimensions', label: 'Dimensions' },
  { value: 'uom', label: 'UOM' }
];

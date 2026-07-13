import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useSupplier } from '../../hooks/master-data/useSupplier';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { SupplierFormModal } from '../../components/master-data/SupplierFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Supplier: React.FC = () => {
  const {
    supplier,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedSupplier,
    setSelectedSupplier,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    supplierToDelete,
    fetchSupplier,
    handleExecuteDelete,
  } = useSupplier();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Supplier Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedSupplier(null);
              setFormModalOpen(true);
            }}
            text="Create Supplier"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={supplier}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Supplier..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <SupplierFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchSupplier}
                editingSupplier={selectedSupplier}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Supplier: "${supplierToDelete?.supplier_name}"`}
        message={`Are you completely sure you want to delete the supplier "${supplierToDelete?.supplier_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Supplier
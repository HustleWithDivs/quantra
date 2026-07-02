import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useMaterial } from '../../hooks/master-data/material';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { MaterialFormModal } from '../../components/master-data/MaterialFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Material: React.FC = () => {
  const {
    material,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedMaterial,
    setSelectedMaterial,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    materialToDelete,
    fetchMaterial,
    handleExecuteDelete,
  } = useMaterial();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Material Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedMaterial(null);
              setFormModalOpen(true);
            }}
            text="Create Material"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={material}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Material..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <MaterialFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchMaterial}
                editingMaterial={selectedMaterial}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Material: "${materialToDelete?.material_name}"`}
        message={`Are you completely sure you want to delete the material "${materialToDelete?.material_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Material
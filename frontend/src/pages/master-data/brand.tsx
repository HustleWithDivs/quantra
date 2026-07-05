import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useBrand } from '../../hooks/master-data/useBrand';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { BrandFormModal } from '../../components/master-data/BrandFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Brand: React.FC = () => {
  const {
    brand,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedBrand,
    setSelectedBrand,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    brandToDelete,
    fetchBrand,
    handleExecuteDelete,
  } = useBrand();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Brand Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedBrand(null);
              setFormModalOpen(true);
            }}
            text="Create Brand"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={brand}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Brand..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <BrandFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchBrand}
                editingBrand={selectedBrand}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Brand: "${brandToDelete?.brand_name}"`}
        message={`Are you completely sure you want to delete the brand "${brandToDelete?.brand_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Brand
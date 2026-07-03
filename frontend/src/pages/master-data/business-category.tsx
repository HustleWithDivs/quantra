import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useBusinessCategory } from '../../hooks/master-data/business-category';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { BusinessCategoryFormModal } from '../../components/master-data/BusinessCategoryFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const BusinessCategory: React.FC = () => {
  const {
    business_category,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedBusinessCategory,
    setSelectedBusinessCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    business_categoryToDelete,
    fetchBusinessCategory,
    handleExecuteDelete,
  } = useBusinessCategory();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">BusinessCategory Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedBusinessCategory(null);
              setFormModalOpen(true);
            }}
            text="Create Business Category"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={business_category}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  BusinessCategory..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <BusinessCategoryFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchBusinessCategory}
                editingBusinessCategory={selectedBusinessCategory}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete BusinessCategory: "${business_categoryToDelete?.business_category_name}"`}
        message={`Are you completely sure you want to delete the business_category "${business_categoryToDelete?.business_category_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default BusinessCategory
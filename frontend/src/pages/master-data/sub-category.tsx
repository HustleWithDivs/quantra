import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useSubCategory } from '../../hooks/master-data/useSubCategory';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { SubCategoryFormModal } from '../../components/master-data/SubCategoryFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const SubCategory: React.FC = () => {
  const {
    subCategory,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedSubCategory,
    setSelectedSubCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    subCategoryToDelete,
    fetchSubCategory,
    handleExecuteDelete,
  } = useSubCategory();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">SubCategory Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedSubCategory(null);
              setFormModalOpen(true);
            }}
            text="Create SubCategory"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={subCategory}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  SubCategory..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <SubCategoryFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchSubCategory}
                editingSubCategory={selectedSubCategory}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete SubCategory: "${subCategoryToDelete?.sub_category_name}"`}
        message={`Are you completely sure you want to delete the sub_category "${subCategoryToDelete?.sub_category_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default SubCategory
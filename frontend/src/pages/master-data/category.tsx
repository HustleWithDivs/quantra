import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useCategory } from '../../hooks/master-data/useCategory';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { CategoryFormModal } from '../../components/master-data/CategoryFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Category: React.FC = () => {
  const {
    category,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedCategory,
    setSelectedCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    categoryToDelete,
    fetchCategory,
    handleExecuteDelete,
  } = useCategory();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Category Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedCategory(null);
              setFormModalOpen(true);
            }}
            text="Create Category"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={category}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Category..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <CategoryFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchCategory}
                editingCategory={selectedCategory}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Category: "${categoryToDelete?.category_name}"`}
        message={`Are you completely sure you want to delete the category "${categoryToDelete?.category_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Category
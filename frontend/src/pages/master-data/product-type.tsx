import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useProductType } from '../../hooks/master-data/useProductType';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { ProductTypeFormModal } from '../../components/master-data/ProductTypeFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const ProductType: React.FC = () => {
  const {
    product_type,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedProductType,
    setSelectedProductType,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    productTypeToDelete,
    fetchProductType,
    handleExecuteDelete,
  } = useProductType();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">ProductType Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedProductType(null);
              setFormModalOpen(true);
            }}
            text="Create ProductType"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={product_type}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Product Type..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <ProductTypeFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchProductType}
                editingProductType={selectedProductType}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete ProductType: "${productTypeToDelete?.product_type}"`}
        message={`Are you completely sure you want to delete the product_type "${productTypeToDelete?.product_type}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default ProductType
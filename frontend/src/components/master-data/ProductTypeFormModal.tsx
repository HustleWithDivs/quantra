import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useProductTypeForm } from '../../hooks/master-data/useProductTypeForm';
import { type ProductType } from '../../api/productTypeApi';

interface ProductTypeFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProductType: ProductType | null;
}

export const ProductTypeFormModal: React.FC<ProductTypeFormModalProps> = ({
  show,
  onClose,
  onSave,
  editingProductType,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,
    subCategories,
    control,
  } = useProductTypeForm({ show, onClose, onSave, editingProductType });

  return (
    <QuantraModal
      show={show}
      onClose={onClose}
      title={
        isEditMode
          ? `Modify Product Type: ${editingProductType?.product_type}`
          : 'Create Product Type'
      }
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton
            variant="outline-secondary"
            onClick={onClose}
            disabled={isSaving || isPageLoading}
          >
            Cancel
          </QuantraButton>
          {/* Explicitly bind handleSubmit(onSubmitForm) to onClick */}
          <QuantraButton
            variant="primary"
            isLoading={isSaving}
            disabled={isPageLoading}
            onClick={handleSubmit(onSubmitForm)}
          >
            {isEditMode ? 'Save Changes' : 'Create Product Type'}
          </QuantraButton>
        </div>
      }
    >
      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small fw-medium">Syncing...</span>
        </div>
      ) : (
        <Form onSubmit={handleSubmit(onSubmitForm)}>
          <Row>
            <Col md={12} className="fw-medium small mb-2 d-flex justify-content-end">
              <Form.Check
                type="switch"
                id="product_type_active_switch"
                label={`${is_active ? 'Activate' : 'Suspend'} Product Type`}
                {...register('is_active')}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <QuantraInputField
                label="Product Type Name"
                disabled={isEditMode}
                error={errors.product_type}
                placeholder="e.g., Electronics, Apparel"
                {...register('product_type')}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              {/* Ensure name matches subcategory_id in useProductTypeForm */}
              <QuantraSelectField
                label="SubCategory"
                name="subcategory_id"
                options={subCategories}
                error={errors.subcategory_id}
                placeholder="Select subcategory..."
                control={control}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <QuantraInputField
                label="Description"
                type="textarea"
                rows={2}
                error={errors.product_type_description}
                placeholder="Enter description..."
                {...register('product_type_description')}
              />
            </Col>
          </Row>
        </Form>
      )}
    </QuantraModal>
  );
};
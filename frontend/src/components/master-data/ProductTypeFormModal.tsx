import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useProductTypeForm } from '../../hooks/master-data/useProductTypeForm'; // Import custom hook
import { type ProductType } from '../../api/productTypeApi';
interface ProductTypeFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProductType: ProductType | null;
}

export const ProductTypeFormModal: React.FC<ProductTypeFormModalProps> = ({ show, onClose, onSave, editingProductType }) => {
  // Destructure logic, bindings, and tracking references directly from form engine hook
  const {
    register,
    handleSubmit,
    errors,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,
    control,
    subCategories,
  } = useProductTypeForm({ show, onClose, onSave, editingProductType });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify ProductType:${editingProductType?.product_type_name} ` : 'Create ProductType'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create ProductType'}
          </QuantraButton>
        </div>
      }
    >
      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small fw-medium">Syncing ...</span>
        </div>
      ) : (
        <Form onSubmit={handleSubmit(onSubmitForm)}>
            <Row>
                      <Col md={12} className="fw-medium small mb-0  d-flex justify-content-end">
                        <Form.Check type="switch" id="product_type-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} ProductType`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Product Type Name"
                disabled={isEditMode}
                error={errors.product_type}
                placeholder="e.g., Formal Shirt, Casual Shirt"
                {...register('product_type')}
              />
            </Col>
            
          </Row>
          <Row className="mb-4 align-items-center">
                      {/* CLEAN SINGLE-SELECT BOX FOR buisness category ALLOCATION ENTRY */}
                      <Col md={12}>
                           <QuantraSelectField
                                        label="Sub Category"
                                        name="sub_category_id"
                                        options={subCategories}
                                        error={errors.sub_category_id}
                                        placeholder="Select sub category ..."
                                        control={control}
                                      />
                      </Col>
                      
                      
                    </Row>
          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.product_type_description}
            placeholder="Enter the description...."
            {...register('product_type_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
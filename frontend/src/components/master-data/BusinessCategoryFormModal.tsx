import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useBusinessCategoryForm } from '../../hooks/master-data/useBusinessCategoryForm'; // Import custom hook
import { type BusinessCategory } from '../../api/businessCategoryApi';

interface BusinessCategoryFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingBusinessCategory: BusinessCategory | null;
}

export const BusinessCategoryFormModal: React.FC<BusinessCategoryFormModalProps> = ({ show, onClose, onSave, editingBusinessCategory }) => {
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
  } = useBusinessCategoryForm({ show, onClose, onSave, editingBusinessCategory });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify BusinessCategory:${editingBusinessCategory?.business_category_name} ` : 'Create Business Category'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Business Category'}
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
                        <Form.Check type="switch" id="business-category-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} BusinessCategory`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Buisness category Name"
                disabled={isEditMode}
                error={errors.business_category_name}
                placeholder="e.g., Electronic, Fashion"
                {...register('business_category_name')}
              />
            </Col>
            
          </Row>

          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.business_category_description}
            placeholder="Enter Business category description...."
            {...register('business_category_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
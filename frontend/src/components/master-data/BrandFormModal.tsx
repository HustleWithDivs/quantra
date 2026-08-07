import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useBrandForm } from '../../hooks/master-data/useBrandForm'; // Import custom hook
import { type Brand } from '../../api/brandApi';

interface BrandFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingBrand: Brand | null;
}

export const BrandFormModal: React.FC<BrandFormModalProps> = ({ show, onClose, onSave, editingBrand }) => {
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
  } = useBrandForm({ show, onClose, onSave, editingBrand });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Brand:${editingBrand?.brand_name} ` : 'Create Brand'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Brand'}
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
                        <Form.Check type="switch" id="brand-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Brand`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Brand Name"
                disabled={isEditMode}
                error={errors.brand_name}
                placeholder="e.g., Addidas, H&M"
                {...register('brand_name')}
              />
            </Col>
            
          </Row>

          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.description}
            placeholder="Enter brand description...."
            {...register('description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
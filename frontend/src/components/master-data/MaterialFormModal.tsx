import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useMaterialForm } from '../../hooks/master-data/useMaterialForm'; // Import custom hook
import { type Material } from '../../api/materialApi';

interface MaterialFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingMaterial: Material | null;
}

export const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ show, onClose, onSave, editingMaterial }) => {
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
  } = useMaterialForm({ show, onClose, onSave, editingMaterial });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Material:${editingMaterial?.material_name} ` : 'Create Material'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Material'}
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
                        <Form.Check type="switch" id="material-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Material`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Material Name"
                disabled={isEditMode}
                error={errors.material_name}
                placeholder="e.g., Cotton, Linen"
                {...register('material_name')}
              />
            </Col>
            
          </Row>

          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.material_description}
            placeholder="Enter material description...."
            {...register('material_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
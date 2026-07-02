import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useSupplierForm } from '../../hooks/master-data/useSupplierForm'; // Import custom hook
import { type Supplier } from '../../api/supplierApi';

interface SupplierFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingSupplier: Supplier | null;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({ show, onClose, onSave, editingSupplier }) => {
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
  } = useSupplierForm({ show, onClose, onSave, editingSupplier });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Supplier:${editingSupplier?.supplier_code} ` : 'Create Supplier'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Supplier'}
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
                        <Form.Check type="switch" id="supplier-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Supplier`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Supplier Code"
                disabled={isEditMode}
                error={errors.supplier_code}
                placeholder="e.g., myntra, amazon"
                {...register('supplier_code')}
              />
            </Col>
            
          </Row>

          <QuantraInputField
            label="Supplier code"
            
            type="textarea"
            rows={2}
            error={errors.supplier_code}
            placeholder="Enter supplier code...."
            {...register('supplier_code')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useDepartmentForm } from '../../hooks/master-data/useDepartmentForm'; // Import custom hook
import { type Department } from '../../api/departmentApi';
interface DepartmentFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingDepartment: Department | null;
}

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({ show, onClose, onSave, editingDepartment }) => {
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
    businessCategories,
  } = useDepartmentForm({ show, onClose, onSave, editingDepartment });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Department:${editingDepartment?.department_name} ` : 'Create Department'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Department'}
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
                        <Form.Check type="switch" id="department-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Department`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Department Name"
                disabled={isEditMode}
                error={errors.department_name}
                placeholder="e.g., Mobile Phones & Tablets, Audio, Men, Women"
                {...register('department_name')}
              />
            </Col>
            
          </Row>
          <Row className="mb-4 align-items-center">
                      {/* CLEAN SINGLE-SELECT BOX FOR buisness category ALLOCATION ENTRY */}
                      <Col md={12}>
                           <QuantraSelectField
                                        label="Buisness Category"
                                        name="business_category_id"
                                        options={businessCategories}
                                        error={errors.business_category_id}
                                        placeholder="Select buisness category ..."
                                        control={control}
                                      />
                      </Col>
                      
                      
                    </Row>
          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.department_description}
            placeholder="Enter the description...."
            {...register('department_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
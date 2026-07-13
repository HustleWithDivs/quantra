import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useCategoryForm } from '../../hooks/master-data/useCategoryForm'; // Import custom hook
import { type Category } from '../../api/categoryApi';
interface CategoryFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCategory: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ show, onClose, onSave, editingCategory }) => {
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
    department,
  } = useCategoryForm({ show, onClose, onSave, editingCategory });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Category:${editingCategory?.category_name} ` : 'Create Category'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Category'}
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
                        <Form.Check type="switch" id="category-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Category`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Category Name"
                disabled={isEditMode}
                error={errors.category_name}
                placeholder="e.g., Addidas, H&M"
                {...register('category_name')}
              />
            </Col>
            
          </Row>
          <Row className="mb-4 align-items-center">
                      {/* CLEAN SINGLE-SELECT BOX FOR buisness category ALLOCATION ENTRY */}
                      <Col md={12}>
                           <QuantraSelectField
                                        label="Department"
                                        name="department_id"
                                        options={department}
                                        error={errors.department_id}
                                        placeholder="Select department ..."
                                        control={control}
                                      />
                      </Col>
                      
                      
                    </Row>
          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.category_description}
            placeholder="Enter category category_description...."
            {...register('category_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
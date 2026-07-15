import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useSubCategoryForm } from '../../hooks/master-data/useSubCategoryForm'; // Import custom hook
import { type SubCategory } from '../../api/subCategoryApi';
interface SubCategoryFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingSubCategory: SubCategory | null;
}

export const SubCategoryFormModal: React.FC<SubCategoryFormModalProps> = ({ show, onClose, onSave, editingSubCategory }) => {
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
    category,
  } = useSubCategoryForm({ show, onClose, onSave, editingSubCategory });

  
  
  return (

    
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify SubCategory:${editingSubCategory?.sub_category_name} ` : 'Create SubCategory'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create SubCategory'}
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
                        <Form.Check type="switch" id="sub_category_-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} SubCategory`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="SubCategory Name"
                disabled={isEditMode}
                error={errors.sub_category_name}
                placeholder="e.g., Premium Smartphones, Shirts, Tops"
                {...register('sub_category_name')}
              />
            </Col>
            
          </Row>
          <Row className="mb-4 align-items-center">
                      {/* CLEAN SINGLE-SELECT BOX FOR buisness category ALLOCATION ENTRY */}
                      <Col md={12}>
                           <QuantraSelectField
                                        label="Category"
                                        name="category_id"
                                        options={category}
                                        error={errors.category_id}
                                        placeholder="Select category ..."
                                        control={control}
                                      />
                      </Col>
                      
                      
                    </Row>
          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.sub_category_description}
            placeholder="Enter subcategory description...."
            {...register('sub_category_description')}
          />


        </Form>
      )}
    </QuantraModal>
  );
};
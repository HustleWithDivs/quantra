import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useUserForm } from '../../hooks/user-management/useUserForm';
import { type User } from '../../api/userApi';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { GenderOptions } from '../../utilities/UserManagement';

interface UserFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingUser: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ show, onClose, onSave, editingUser }) => {
  const {
    register,
    handleSubmit,
    errors,
    availableRoles,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,
    control,
  } = useUserForm({ show, onClose, onSave, editingUser });

  return (
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Update User Account: ${editingUser?.first_name} ${editingUser?.last_name}` : 'Create User'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create User'}
          </QuantraButton>
        </div>
      }
    >
      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small fw-medium">Syncing account assignment rules configurations...</span>
        </div>
      ) : (
        <Form onSubmit={handleSubmit(onSubmitForm)}>
            <Row>
            <Col md={12} className="fw-medium small mb-0  d-flex justify-content-end">
              <Form.Check type="switch" id="user-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Account`} {...register('is_active')}/>
            </Col>
            </Row>
          <Row>
            
            <Col md={6}>
              <QuantraInputField label="First Name" error={errors.first_name} placeholder="John" {...register('first_name')} />
            </Col>
            <Col md={6}>
              <QuantraInputField label="Last Name"  error={errors.last_name} placeholder="Doe" {...register('last_name')} />
            </Col>
            
          </Row>

          <Row className="align-items-center">
            <Col md={6}>
              <QuantraInputField label="Account Email" type="email" error={errors.email} placeholder="johndoe@enterprise.com" disabled={isEditMode} {...register('email')} />
            </Col>
            <Col md={6}>
                <QuantraSelectField
                              label="Gender"
                              
                              options={GenderOptions}
                              control={control}
                              error={errors.gender}
                              placeholder="Select Gender ..."
                              {...register('gender')}
                            />
            </Col>
          </Row>

          <Row className="mb-4 align-items-center">
            {/* CLEAN SINGLE-SELECT BOX FOR ROLE ALLOCATION ENTRY */}
            <Col md={12}>
                 <QuantraSelectField
                              label="Roles"
                              
                              options={availableRoles}
                              control={control}
                              error={errors.role_id}
                              placeholder="Select Role ..."
                              {...register('role_id')}
                            />
            </Col>
            
            
          </Row>
        </Form>
      )}
    </QuantraModal>
  );
};
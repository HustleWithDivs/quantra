import React from 'react';
import { Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useRoleForm } from '../../hooks/user-management/useRoleForm'; // Import custom hook
import { type Role } from '../../api/roleApi';

interface RoleFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingRole: Role | null;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({ show, onClose, onSave, editingRole }) => {
  // Destructure logic, bindings, and tracking references directly from form engine hook
  const {
    register,
    handleSubmit,
    errors,
    permissions,
    selectedPermissions,
    isPageLoading,
    isSaving,
    isEditMode,
    handleTogglePermission,
    onSubmitForm,
    is_active,
  } = useRoleForm({ show, onClose, onSave, editingRole });

  return (
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Modify Role:${editingRole?.role_name} ` : 'Create Role'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={handleSubmit(onSubmitForm)}>
            {isEditMode ? 'Save Changes' : 'Create Role'}
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
                        <Form.Check type="switch" id="role-active-switch" label={`${is_active ? 'Activate' : 'Suspend'} Role`} {...register('is_active')}/>
                      </Col>
                      </Row>
          
          <Row>
            
            <Col md={12}>
              <QuantraInputField
                label="Role Name"
                disabled={isEditMode}
                error={errors.role_name}
                placeholder="e.g., Regional Manager, Compliance Inspector"
                {...register('role_name')}
              />
            </Col>
            
          </Row>

          <QuantraInputField
            label="Description"
            
            type="textarea"
            rows={2}
            error={errors.description}
            placeholder="Briefly summarize what operations this role profile authorizes..."
            {...register('description')}
          />

          <div className="mt-4">
            <h6 className="fw-bold text-secondary mb-1">Permission Allocation</h6>
            <p className="text-muted small mb-3">Select capabilities for role</p>

            <Row className="g-3">
              {permissions.map((perm) => (
                <Col md={6} key={perm.permission_id}>
                  <Card className="h-100 border-0 shadow-sm bg-body-tertiary">
                    <Card.Body className="p-3">
                      <h6 className="text-primary fw-bold text-capitalize border-bottom pb-2 mb-2">
                        {perm.slug}
                      </h6>
                      
                        <Form.Check
                          key={perm.permission_id}
                          type="checkbox"
                          id={`perm-check-${perm.permission_id}`}
                          label={perm.description}
                          checked={selectedPermissions.includes(perm.permission_id)}
                          onChange={() => handleTogglePermission(perm.permission_id)}
                          className="small my-2"
                          title={perm.description}
                        />
                      
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Form>
      )}
    </QuantraModal>
  );
};
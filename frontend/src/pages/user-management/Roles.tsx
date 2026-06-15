import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useRoles } from '../../hooks/user-management/useRoles';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { RoleFormModal } from '../../components/user-management/RoleFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Roles: React.FC = () => {
  const {
    roles,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedRole,
    setSelectedRole,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    roleToDelete,
    fetchRoles,
    handleExecuteDelete,
  } = useRoles();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Role Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedRole(null);
              setFormModalOpen(true);
            }}
            text="Create Role"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Roles..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
      {formModalOpen && (
        <RoleFormModal
          show={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={fetchRoles}
          editingRole={selectedRole}
        />
      )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Role: "${roleToDelete?.role_name}"`}
        message={`Are you completely sure you want to delete the role profile "${roleToDelete?.role_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Roles
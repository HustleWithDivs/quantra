import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiUserCircle } from 'react-icons/bi';
import { useUsers } from '../../hooks/user-management/useUsers';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { UserFormModal } from '../../components/user-management/UserFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

export const Users: React.FC = () => {
  const {
    users,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns,
    formModalOpen,
    setFormModalOpen,
    selectedUser,
    setSelectedUser,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    userToDelete,
    fetchUsers,
    handleExecuteDelete,
  } = useUsers();

  return (
    <Container fluid className="py-4 px-4">
      {/* Title Header Section Grid Layout */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiUserCircle className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">User Management</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedUser(null);
              setFormModalOpen(true);
            }}
            text="Add User"
          />
        </Col>
      </Row>

      {/* Quantra Table Injection Module Elements */}
      <QuantraTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search User"
        tableController={tableController}
      />

      {/* Form Interaction Controller Overlays */}
      {formModalOpen && (
        <UserFormModal
          show={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={fetchUsers}
          editingUser={selectedUser}
        />
      )}

      {/* Deletion Prompt Safeguard Confirms Box */}
      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete User: "${userToDelete?.first_name} ${userToDelete?.last_name}"`}
        message={`Are you completely sure you want to remove the  user  "${userToDelete?.first_name} ${userToDelete?.last_name}"? This will terminate active API tokens instantly.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};

export default Users;
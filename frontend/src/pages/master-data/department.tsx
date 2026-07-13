import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiPlus, BiShieldQuarter } from 'react-icons/bi';
import { useDepartment } from '../../hooks/master-data/useDepartment';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { DepartmentFormModal } from '../../components/master-data/DepartmentFormModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

const Department: React.FC = () => {
  const {
    department,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Injected with handlers baked in directly by the hook wrapper
    formModalOpen,
    setFormModalOpen,
    selectedDepartment,
    setSelectedDepartment,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    departmentToDelete,
    fetchDepartment,
    handleExecuteDelete,
  } = useDepartment();

  return (
    <Container fluid className="py-4 px-4">
      {/* Structural Title Metadata Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiShieldQuarter className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Department Configurations</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={() => {
              setSelectedDepartment(null);
              setFormModalOpen(true);
            }}
            text="Create Department"
          />
        </Col>
      </Row>

      {/* Reusable Data Table abstraction rendering */}
      <QuantraTable
        columns={columns}
        data={department}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search  Department..."
        tableController={tableController}
      />

      {/* Conditional Overlays Section */}
            {formModalOpen && (
              <DepartmentFormModal
                show={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={fetchDepartment}
                editingDepartment={selectedDepartment}
              />
            )}

      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Department: "${departmentToDelete?.department_name}"`}
        message={`Are you completely sure you want to delete the department "${departmentToDelete?.department_name}"? All users bound to this credential group layout will lose authorization.`}
        confirmText="Confirm"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};
export default Department
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Import Button
import { BiLayer, BiUpload } from 'react-icons/bi'; // Import BiUpload icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useMappingTemplates } from '../../hooks/import-data/useMappingList';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { EditTemplateModal } from '../../components/import-data/EditTemplateModal';
import { QuantraTable } from '../../components/reusable/QuantraTable';

export const MappingListPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  const {
    templates,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns,
    formModalOpen,
    setFormModalOpen,
    selectedTemplate,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    templateToDelete,
    fetchTemplates,
    handleExecuteDelete,
  } = useMappingTemplates();

  return (
    <Container fluid className="py-4 px-4">
      {/* Title Header Section Grid Layout */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiLayer className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Schema Mapping Vault</h4>
          </div>
        </Col>
        {/* Added Navigation Action Button */}
        <Col xs="auto">
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2"
            onClick={() => navigate('/bulk-import')}
          >
            <BiUpload className="fs-5" />
            <span>Bulk Import Assets</span>
          </Button>
        </Col>
      </Row>

      {/* Quantra Table Injection Module Elements */}
      <QuantraTable
        columns={columns}
        data={templates}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Search Schema Template..."
        tableController={tableController}
      />

      {/* Form Interaction Controller Overlays */}
      {formModalOpen && (
        <EditTemplateModal
          show={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={fetchTemplates}
          editingTemplate={selectedTemplate}
        />
      )}

      {/* Deletion Prompt Safeguard Confirms Box */}
      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Delete Schema Template: "${templateToDelete?.template_name}"`}
        message={`Are you completely sure you want to delete template layout "${templateToDelete?.template_name}"? Future uploads matching this file architecture will require fresh AI configurations.`}
        confirmText="Remove Matrix"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};

export default MappingListPage;
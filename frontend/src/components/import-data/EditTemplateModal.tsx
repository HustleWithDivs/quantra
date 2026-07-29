import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { DB_PRODUCT_TARGET_FIELDS, type MappingTemplate } from '../../utilities/MappingManagement';
import { useMappingForm } from '../../hooks/import-data/useMappingForm';

interface EditTemplateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingTemplate: MappingTemplate | null;
}

export const EditTemplateModal: React.FC<EditTemplateModalProps> = ({ show, onClose, onSave, editingTemplate }) => {
  // 1. Instantiate form controls first
  const { control, setValue } = useForm();

  // 2. Pass setValue directly to the logic hook block
  const {
    name,
    setName,
    mappings,
    handleValueChange,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
  } = useMappingForm({ show, onClose, onSave, editingTemplate, setValue });

  return (
    <QuantraModal
      show={show}
      onClose={onClose}
      title={isEditMode ? `Update Mapping Configuration: ${editingTemplate?.template_name}` : 'Create Mapping'}
      size="lg"
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton variant="outline-secondary" onClick={onClose} disabled={isSaving || isPageLoading}>
            Cancel
          </QuantraButton>
          <QuantraButton variant="primary" isLoading={isSaving} disabled={isPageLoading} onClick={() => onSubmitForm()}>
            Save Changes
          </QuantraButton>
        </div>
      }
    >
      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small fw-medium">Syncing layout scheme relational configurations...</span>
        </div>
      ) : (
        <Form onSubmit={onSubmitForm}>
          <Row className="mb-4">
            <Col md={12}>
              <QuantraInputField
                label="Template Profile Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Supplier Default Feed Matrix"
              />
            </Col>
          </Row>

          <h6 className="fw-bold mb-3 text-secondary text-uppercase tracking-wide" style={{ fontSize: '0.75rem' }}>
            Schema Target Relational Bindings
          </h6>

          <div className="border rounded bg-light p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(mappings).map(([csvHeader, targetField]) => (
              <Row key={csvHeader} className="align-items-center mb-3 bg-white p-2 mx-0 rounded border shadow-sm">
                <Col md={5} className="text-truncate">
                  <span className="font-mono text-xs fw-bold text-dark" title={csvHeader}>
                    {csvHeader}
                  </span>
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>Incoming File Header</div>
                </Col>
                
                <Col md={1} className="text-center text-muted small fw-bold">
                  ➔
                </Col>
                
                <Col md={6}>
                  <QuantraSelectField
                    name={`mapping_${csvHeader}`}
                    label=""
                    options={DB_PRODUCT_TARGET_FIELDS}
                    control={control}
                    placeholder="Select System Destination Field..."
                    onChange={(selectedOption: any) => {
                      handleValueChange(csvHeader, selectedOption ? selectedOption.value : '');
                    }}
                  />
                </Col>
              </Row>
            ))}
          </div>
        </Form>
      )}
    </QuantraModal>
  );
};
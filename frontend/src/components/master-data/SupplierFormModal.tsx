import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { QuantraModal } from '../reusable/QuantraModal';
import { QuantraInputField } from '../reusable/QuantraInputField';
import { QuantraButton } from '../reusable/QuantraButton';
import { useSupplierForm } from '../../hooks/master-data/useSupplierForm';
import { type Supplier } from '../../api/supplierApi';

interface SupplierFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingSupplier: Supplier | null;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  show,
  onClose,
  onSave,
  editingSupplier,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,
  } = useSupplierForm({
    show,
    onClose,
    onSave,
    editingSupplier,
  });

  return (
    <QuantraModal
      show={show}
      onClose={onClose}
      size="lg"
      title={
        isEditMode
          ? `Modify Supplier : ${editingSupplier?.supplier_code}`
          : 'Create Supplier'
      }
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton
            variant="outline-secondary"
            onClick={onClose}
            disabled={isSaving || isPageLoading}
          >
            Cancel
          </QuantraButton>

          <QuantraButton
            variant="primary"
            isLoading={isSaving}
            disabled={isPageLoading}
            onClick={handleSubmit(onSubmitForm)}
          >
            {isEditMode ? 'Save Changes' : 'Create Supplier'}
          </QuantraButton>
        </div>
      }
    >
      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
          <span className="small text-muted mt-2">
            Loading Supplier Details...
          </span>
        </div>
      ) : (
        <Form onSubmit={handleSubmit(onSubmitForm)}>
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
              <Form.Check
                type="switch"
                id="supplier-active-switch"
                label={is_active ? 'Active Supplier' : 'Inactive Supplier'}
                {...register('is_active')}
              />
            </Col>
          </Row>

          <Row className="g-3">

            <Col md={6}>
              <QuantraInputField
                label="Supplier Code"
                disabled={isEditMode}
                error={errors.supplier_code}
                placeholder="SUP001"
                {...register('supplier_code')}
              />
            </Col>

            <Col md={6}>
              <QuantraInputField
                label="Supplier Name"
                error={errors.supplier_name}
                placeholder="ABC Suppliers Pvt Ltd"
                {...register('supplier_name')}
              />
            </Col>

            <Col md={6}>
              <QuantraInputField
                label="Contact Person"
                error={errors.contact_person}
                placeholder="John Smith"
                {...register('contact_person')}
              />
            </Col>

            <Col md={6}>
              <QuantraInputField
                label="Email"
                type="email"
                error={errors.email}
                placeholder="supplier@company.com"
                {...register('email')}
              />
            </Col>

            <Col md={6}>
              <QuantraInputField
                label="Phone"
                error={errors.phone}
                placeholder="+91 9876543210"
                {...register('phone')}
              />
            </Col>

            <Col md={6}>
              <QuantraInputField
                label="GST Number"
                error={errors.gst_number}
                placeholder="27ABCDE1234F1Z5"
                {...register('gst_number')}
              />
            </Col>

            <Col md={4}>
              <QuantraInputField
                label="City"
                error={errors.city}
                placeholder="Mumbai"
                {...register('city')}
              />
            </Col>

            <Col md={4}>
              <QuantraInputField
                label="State"
                error={errors.state}
                placeholder="Maharashtra"
                {...register('state')}
              />
            </Col>

            <Col md={4}>
              <QuantraInputField
                label="Country ID"
                type="number"
                error={errors.country_id}
                placeholder="101"
                {...register('country_id')}
              />
            </Col>

            <Col md={12}>
              <QuantraInputField
                label="Address"
                type="textarea"
                rows={3}
                error={errors.address}
                placeholder="Complete supplier address"
                {...register('address')}
              />
            </Col>

          </Row>
        </Form>
      )}
    </QuantraModal>
  );
};

export default SupplierFormModal;
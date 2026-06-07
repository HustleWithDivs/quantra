import React from 'react';
import { Card, Button, Stack } from 'react-bootstrap';
// Import our custom reusable design token components
import { QuantraModal } from '../../components/reusable/QuantraModal';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { QuantraButton } from '../../components/reusable/QuantraButton';

// Import our isolated operational logic engine hooks
import { useQuantraModal } from '../../hooks/reusable/useQuantraModal';
import { useQuantraConfirmBox } from '../../hooks/reusable/useQuantraConfirmBox';
// Icon assets for visual anchor consistency
import { BiTrash, BiSliderAlt, BiXCircle, BiCheckCircle } from 'react-icons/bi';

export default function ModalWorkspace() {
  // 1. Initialize the custom hook loop engines independently
  const modalController = useQuantraModal(false);
  
  // 2. Define the asynchronous API mutation operation for the confirmation step
  const handlePurgeTelemetryRecords = async () => {
    console.log('📡 Dispatching API Mutation Request: DELETE /api/v1/telemetry/purge-all');
    // Simulate server network latency processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('✅ Telemetry database matrix purged successfully from core infrastructure.');
  };

  const confirmController = useQuantraConfirmBox({
    onExecuteApiCall: handlePurgeTelemetryRecords,
  });

  return (
    <Card className="border-0 shadow-sm p-4 mx-auto my-4 text-start" style={{ maxWidth: '650px' }}>
      <Card.Header className="bg-transparent border-0 ps-0 mb-3">
        <h4 className="fw-bold large-display mb-1">System Control Dashboard</h4>
        <p className="text-muted small mb-0">Unified sandbox testing modal scopes and confirmation transactional overlays</p>
      </Card.Header>

      <Card.Body className="p-0">
        <p className="text-body-secondary small mb-4">
          Click the core telemetry launcher below to trigger a scrolling modal viewport. Inside the modal workspace, 
          you can execute nested verification confirmation transactions safely.
        </p>

        {/* Core Trigger Button using our QuantraButton component */}
        <QuantraButton 
          variant="primary" 
          text="Launch Matrix Node Override Profile" 
          icon={<BiSliderAlt className="fs-5" />}
          onClick={modalController.handleOpenModal}
          className="w-100 py-2"
        />

        {/* ========================================================== */}
        {/* COMPONENT 6: CUSTOM POPUP MODAL SCREEN LAYER                */}
        {/* ========================================================== */}
        <QuantraModal
          show={modalController.isOpen}
          onClose={modalController.handleCloseModal}
          title="Node Cluster Registry Override Panel"
          fullscreen="md-down" // Fluid fullscreen overlay context for smaller browser viewports
          footerActions={
            <div className="d-flex justify-content-end gap-2 w-100">
              <QuantraButton 
                variant="outline-secondary" 
                icon={<BiXCircle className="fs-5" />}
                onClick={modalController.handleCloseModal}
              >
                Abort Stream
              </QuantraButton>
              <QuantraButton 
                variant="success" 
                icon={<BiCheckCircle className="fs-5" />}
                onClick={() => {
                  alert('Standard settings synchronized on grid.');
                  modalController.handleCloseModal();
                }}
              >
                Apply Parameters
              </QuantraButton>
            </div>
          }
        >
          <div className="alert alert-warning border-0 py-2 px-3 small mb-4">
            <strong>Notice:</strong> Modals enforce static background constraints. Clicking outside this box canvas will not close the container workspace.
          </div>

          <h5 className="slide-title h6 mb-2 fw-semibold">Infrastructure Core Management</h5>
          <p className="text-muted small mb-4">
            Review your operational network cluster allocations below. If severe calibration errors are detected across lines, 
            you can execute a hard reset operation using the action vector button.
          </p>

          {/* Destructive Trigger button positioned securely INSIDE the scrolling modal body view */}
          <div className="p-3 border border-danger-subtle bg-danger-subtle bg-opacity-10 rounded mb-4">
            <h6 className="text-danger small fw-bold mb-1">Destructive Telemetry Override Actions</h6>
            <p className="text-body-secondary extra-small mb-3" style={{ fontSize: '0.8rem' }}>
              Purging structural matrices forces an active node cluster recalibration routine.
            </p>
            <QuantraButton
              variant="danger"
              text="Purge Matrix Data Ledger"
              icon={<BiTrash className="fs-5" />}
              onClick={confirmController.handleOpenConfirm}
              className="py-1 px-3 btn-sm"
            />
          </div>

          {/* Simulated scrollable content container space */}
          <div 
            style={{ height: '400px', background: 'linear-gradient(180deg, var(--bs-tertiary-bg), transparent)', padding: '15px' }} 
            className="rounded border border-dashed"
          >
            <code className="d-block small text-success">[SYS_LOG] Initializing particle stream diagnostics...</code>
            <code className="d-block small text-muted mt-2">[SYS_LOG] Core connection links running within stable bounds...</code>
            <code className="d-block small text-muted mt-2">[SYS_LOG] Sub-packet processing lines standard...</code>
          </div>
        </QuantraModal>

        {/* ========================================================== */}
        {/* COMPONENT 7: NESTED REUSABLE CONFIRMATION OVERLAY BOX       */}
        {/* ========================================================== */}
        <QuantraConfirmBox
          show={confirmController.isOpen}
          title="Destructive Action Warning"
          message="Are you absolutely certain you want to purge all active telemetry ledger rows? This action overrides persistent grid nodes and cannot be undone."
          confirmText="Yes, Purge Core"
          cancelText="Abort Operation"
          confirmVariant="danger"
          isLoading={confirmController.isProcessing}
          onCancel={confirmController.handleCloseConfirm}
          onConfirm={confirmController.handleExecuteAction}
        />

      </Card.Body>
    </Card>
  );
}

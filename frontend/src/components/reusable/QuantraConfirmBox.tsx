import React from 'react';
import { QuantraModal } from './QuantraModal';
import { QuantraButton } from './QuantraButton';

interface QuantraConfirmBoxProps {
  show: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary' | 'success';
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

/**
 * Reusable Confirmation Box Component (TypeScript + React-Bootstrap)
 * Consumes the predefined CustomModal and CustomButton elements natively
 */
export const QuantraConfirmBox: React.FC<QuantraConfirmBoxProps> = ({
  show,
  title = 'System Confirmation Required',
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <QuantraModal
      show={show}
      onClose={onCancel}
      title={title}
      size="md" // Kept compact specifically for verification notifications
      footerActions={
        <div className="d-flex justify-content-end gap-2 w-100">
          <QuantraButton
            variant="outline-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </QuantraButton>
          <QuantraButton
            variant={confirmVariant}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </QuantraButton>
        </div>
      }
    >
      <div className="py-2">
        <p className="mb-0 fs-6 text-body-secondary fw-normal">{message}</p>
      </div>
    </QuantraModal>
  );
};

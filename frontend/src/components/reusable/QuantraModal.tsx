import React from 'react';
import { Modal } from 'react-bootstrap';
// Consume our predefined custom button instead of raw Bootstrap elements
import { QuantraButton } from './QuantraButton';

interface QuantraModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm'| 'md' | 'lg' | 'xl';
  fullscreen?: true | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  children: React.ReactNode;
  footerActions?: React.ReactNode; 
}

/**
 * Reusable Popup Modal Component (TypeScript + React-Bootstrap)
 * Enforces static backdrops, scrolling views, and fluid fullscreen variations
 * Utilizes the CustomButton design token for consistent layout structures
 */
export const QuantraModal: React.FC<QuantraModalProps> = ({
  show,
  onClose,
  title,
  size = 'lg',
  fullscreen, 
  children,
  footerActions,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      size={fullscreen ? undefined : size}
      fullscreen={fullscreen || undefined}
      backdrop="static"    
      keyboard={false}       
      scrollable={true}      
      centered               
    >
      <Modal.Header closeButton className="px-4 py-3">
        <Modal.Title className="slide-title h5 mb-0">{title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4 text-body">
        {children}
      </Modal.Body>
      
      <Modal.Footer className="px-4 py-3 bg-light-subtle">
        {footerActions ? (
          footerActions
        ) : (
          /* Swapped native Button to use our CustomButton module */
          <QuantraButton variant="secondary" onClick={onClose} className="px-4">
            Close View
          </QuantraButton>
        )}
      </Modal.Footer>
    </Modal>
  );
};

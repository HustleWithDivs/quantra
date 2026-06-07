import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import type { ButtonProps as BootstrapButtonProps } from 'react-bootstrap';

// Extend all native Bootstrap Button properties with custom UI elements
interface QuantraButtonProps extends BootstrapButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
}

/**
 * Reusable Button Component (TypeScript + React-Bootstrap)
 * Supports Text, Icon-Only, or Combined Layouts natively
 */
export const QuantraButton: React.FC<QuantraButtonProps> = ({
  type = 'button',
  variant = 'primary',
  text,
  icon,
  iconPosition = 'start',
  isLoading = false,
  disabled,
  children,
  ...rest
}) => {
  // Use explicitly passed text or fallback to standard children text nodes
  const displayLabel = text || children;
  
  // An icon-only layout applies if an icon exists but no text labels are detected
  const isIconOnly = !!icon && !displayLabel;

  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled || isLoading}
      className={`d-inline-flex align-items-center justify-content-center ${
        isIconOnly ? 'rounded-circle p-2' : ''
      }`}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className={displayLabel ? 'me-2' : ''}
          />
          {displayLabel && <span>Loading...</span>}
        </>
      ) : (
        <>
          {/* Render Leading Icon */}
          {icon && iconPosition === 'start' && (
            <span className={displayLabel ? 'me-2 d-flex align-items-center' : 'd-flex align-items-center'}>
              {icon}
            </span>
          )}

          {/* Render Text Content Label */}
          {displayLabel && <span>{displayLabel}</span>}

          {/* Render Trailing Icon */}
          {icon && iconPosition === 'end' && (
            <span className={displayLabel ? 'ms-2 d-flex align-items-center' : 'd-flex align-items-center'}>
              {icon}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

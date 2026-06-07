import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
// Explicit Type-Only import to completely satisfy verbatimModuleSyntax
import type { FieldError } from 'react-hook-form';

interface QunatraSearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: FieldError;
  onSearchClick?: () => void;
}

/**
 * Reusable SearchBox Component (TypeScript + React Hook Form + Yup Compatible)
 */
export const QuantraSearchBox = React.forwardRef<HTMLInputElement, QunatraSearchBoxProps>((
  {
    label,
    name,
    placeholder = 'Search operational telemetry...',
    error,
    onSearchClick,
    ...rest
  },
  ref
) => {
  return (
    <Form.Group className="mb-3" controlId={`search-${name}`}>
      {label && <Form.Label className="fw-medium small mb-1">{label}</Form.Label>}
      
      <InputGroup isInvalid={!!error}>
        <Form.Control
          type="text"
          name={name}
          ref={ref}
          placeholder={placeholder}
          isInvalid={!!error}
          {...(rest as React.ComponentPropsWithRef<typeof Form.Control>)}
        />
        
        <InputGroup.Text 
          onClick={onSearchClick} 
          style={{ cursor: onSearchClick ? 'pointer' : 'default' }}
          className="bg-body-secondary text-body-secondary px-3"
        >
          <BiSearch className="fs-5" />
        </InputGroup.Text>
        
        {error && (
          <Form.Control.Feedback type="invalid" className="d-block small">
            {error?.message}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
});

QuantraSearchBox.displayName = 'QuantraSearchBox';

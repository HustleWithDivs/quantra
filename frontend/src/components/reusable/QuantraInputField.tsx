import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import type { FieldError } from 'react-hook-form';

interface QuantraInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  type?: 'text' | 'textarea' | 'button' | 'password' | 'email' | 'number';
  name: string;
  error?: FieldError;
  rows?: number;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * Reusable QuantraInputField Component (TypeScript + React Hook Form + Yup Compatible)
 */
export const QuantraInputField = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, QuantraInputFieldProps>((
  {
    label,
    type = 'text',
    name,
    placeholder,
    error,
    rows = 3,
    buttonText,
    onButtonClick,
    ...rest
  },
  ref
) => {
  
  if (type === 'textarea') {
    return (
      <Form.Group className="mb-3" controlId={`field-${name}`}>
        {label && <Form.Label className="fw-medium small mb-1">{label}</Form.Label>}
        <Form.Control
          as="textarea"
          name={name}
          ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          placeholder={placeholder}
          isInvalid={!!error}
          {...(rest as React.ComponentPropsWithRef<typeof Form.Control>)}
        />
        <Form.Control.Feedback type="invalid" className="small">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  if (type === 'button') {
    return (
      <Form.Group className="mb-3" controlId={`field-${name}`}>
        {label && <Form.Label className="fw-medium small mb-1">{label}</Form.Label>}
        {/* REMOVED isInvalid from InputGroup to resolve ts(2322) */}
        <InputGroup>
          <Form.Control
            type="text"
            name={name}
            ref={ref as unknown as React.Ref<HTMLInputElement>}
            placeholder={placeholder}
            isInvalid={!!error} // Left validation here where it belongs
            {...(rest as React.ComponentPropsWithRef<typeof Form.Control>)}
          />
          <Button 
            variant="primary" 
            onClick={onButtonClick}
            type="button"
          >
            {buttonText || 'Action'}
          </Button>
          {error && (
            <Form.Control.Feedback type="invalid" className="d-block small">
              {error?.message}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Form.Group>
    );
  }

  return (
    <Form.Group className="mb-3" controlId={`field-${name}`}>
      {label && <Form.Label className="fw-medium small mb-1">{label}</Form.Label>}
      <Form.Control
        type={type}
        name={name}
        ref={ref as unknown as React.Ref<HTMLInputElement>}
        placeholder={placeholder}
        isInvalid={!!error}
        {...(rest as React.ComponentPropsWithRef<typeof Form.Control>)}
      />
      <Form.Control.Feedback type="invalid" className="small">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
});

QuantraInputField.displayName = 'QuantraInputField';

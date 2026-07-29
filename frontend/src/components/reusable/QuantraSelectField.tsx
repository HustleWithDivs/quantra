import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import type { MultiValue, SingleValue } from 'react-select';
import type { Control, FieldValues, Path, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export interface QunatraSelectOption {
  value: string | number;
  label: string;
}

interface QuantraSelectProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  options: QunatraSelectOption[];
  isMulti?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  control: Control<any>;
  placeholder?: string;
}

/**
 * Reusable Select Component (TypeScript Generic + React-Select + Hook Form + Yup)
 */
export function QuantraSelectField<T extends FieldValues>({
  label,
  name,
  options,
  isMulti = false,
  error,
  control=null,
  placeholder = 'Select an option...',
}: QuantraSelectProps<T>) {
  
  // Type guard utility to extract a clean string message out from any error tree variant safely
  const getErrorMessage = (): string | null => {
    if (!error) return null;
    if (typeof error.message === 'string') return error.message;
    return 'Invalid selection parameter criteria configuration.';
  };

  const errorMessage = getErrorMessage();

  return (
    <Form.Group className="mb-3" controlId={`select-${name}`}>
      {label && <Form.Label className="fw-medium small mb-1">{label}</Form.Label>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          const getValue = () => {
            if (options) {
              return isMulti
                ? options.filter((option) => (value as Array<string | number>)?.includes(option.value))
                : options.find((option) => option.value === value) || null;
            }
            return isMulti ? [] : null;
          };

          const handleSelectChange = (
            newValue: MultiValue<SelectOption> | SingleValue<SelectOption>
          ) => {
            if (isMulti) {
              onChange((newValue as SelectOption[]).map((opt) => opt.value));
            } else {
              onChange((newValue as SelectOption)?.value || '');
            }
          };

          return (
            <Select
              ref={ref}
              value={getValue()}
              onChange={handleSelectChange}
              options={options}
              isMulti={isMulti}
              placeholder={placeholder}
              classNamePrefix="react-select"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: error ? '#dc3545' : state.isFocused ? '#86b7fe' : '#dee2e6',
                  boxShadow: state.isFocused && error ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : baseStyles.boxShadow,
                  backgroundColor: 'var(--bs-body-bg)',
                  color: 'var(--bs-body-color)',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: 'var(--bs-body-bg)',
                  zIndex: 9999,
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isSelected 
                    ? 'var(--bs-primary)' 
                    : state.isFocused 
                    ? 'var(--bs-tertiary-bg)' 
                    : 'transparent',
                  color: state.isSelected ? '#ffffff' : 'var(--bs-body-color)',
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: 'var(--bs-body-color)',
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: 'var(--bs-secondary-bg)',
                }),
                multiValueLabel: (baseStyles) => ({
                  ...baseStyles,
                  color: 'var(--bs-body-color)',
                }),
              }}
            />
          );
        }}
      />

      {/* FIXED: We pass the string errorMessage variant here to avoid object printing blocks */}
      {errorMessage && (
        <Form.Control.Feedback type="invalid" className="d-block small">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

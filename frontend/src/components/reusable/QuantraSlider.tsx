import React from 'react';
import { Form } from 'react-bootstrap';

interface QuantraSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const QuantraSlider: React.FC<QuantraSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  minLabel,
  maxLabel,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-100 my-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-secondary small fw-medium">{label}</span>
        <span className="fw-bold text-dark fs-6">
          {value > 0 && unit === '%' ? `+${value}` : value}
          {unit}
        </span>
      </div>

      <Form.Range
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="custom-quantra-slider"
      />

      <div className="d-flex justify-content-between text-muted fs-7 mt-1">
        <span>{minLabel || `${min} ${unit}`}</span>
        <span>{maxLabel || `${max} ${unit}`}</span>
      </div>
    </div>
  );
};
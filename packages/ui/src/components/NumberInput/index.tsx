'use client';

import type { ReactNode } from 'react';
import Input from '../Input';
import { cn } from '../../cn';

export interface NumberInputProps {
  id: string;
  /** Optional field label rendered above the control. */
  label?: ReactNode;
  /** Controlled value. */
  value: string | number;
  /** Fires with the raw string value on every change. */
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  /** Trailing unit hint (e.g. `kg`, `d`) shown inside the field on the right. */
  unit?: string;
  /** Renders the error/invalid styling. */
  invalid?: boolean;
  className?: string;
}

/** Aurora numeric input — `type="number"` with an optional label and unit suffix. */
export default function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
  step,
  unit,
  invalid,
  className,
}: NumberInputProps) {
  return (
    <div className="lk-number">
      {label && (
        <label className="lk-form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <span className="lk-number-field">
        <Input
          id={id}
          type="number"
          className={cn(unit && 'lk-number-input-unit', className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          invalid={invalid}
        />
        {unit && (
          <span className="lk-number-unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

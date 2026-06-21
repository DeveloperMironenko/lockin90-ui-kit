import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** faint suffix inside the field, right side (e.g. "kg") */
  unit?: string;
  /** red border + glow to signal an invalid value */
  invalid?: boolean;
  /** field density */
  inputSize?: 'sm' | 'md';
  /** optional leading icon inside the field shell */
  leading?: ReactNode;
}

/** Dark glassy text input — mono label, faint unit suffix, focus glow. */
export function Input({
  label,
  unit,
  invalid = false,
  inputSize = 'md',
  leading,
  className,
  ...rest
}: InputProps) {
  return (
    <label className="lk-input-wrap">
      {label ? <span className="lk-input-label">{label}</span> : null}
      <span className={cn('lk-input-field', inputSize === 'sm' && 'lk-input-sm', invalid && 'lk-input-invalid')}>
        {leading ? <span className="lk-input-lead">{leading}</span> : null}
        <input className={cn('lk-input', className)} aria-invalid={invalid || undefined} {...rest} />
        {unit ? <span className="lk-input-unit">{unit}</span> : null}
      </span>
    </label>
  );
}

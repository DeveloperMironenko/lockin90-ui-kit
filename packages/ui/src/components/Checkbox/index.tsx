'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  /** Text/label shown next to the box. */
  label?: ReactNode;
  className?: string;
}

/** Aurora checkbox row — a styled native checkbox with an optional label. */
export default function Checkbox({ label, className, disabled, ...rest }: CheckboxProps) {
  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input type="checkbox" className={cn('lk-checkbox')} disabled={disabled} {...rest} />
      {label}
    </label>
  );
}

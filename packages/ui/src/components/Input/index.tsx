'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Renders the error/invalid styling (`lk-invalid`) and sets `aria-invalid`. */
  invalid?: boolean;
  /**
   * Back-compat: when given, renders a label above the input (wired to the
   * input's `id` via `htmlFor`).
   */
  label?: ReactNode;
  className?: string;
}

/** Aurora text input. Controlled or uncontrolled via native `value`/`defaultValue`. */
export default function Input({ invalid, label, className, ...rest }: InputProps) {
  const input = (
    <input
      className={cn('lk-input', invalid && 'lk-invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );

  if (label == null) return input;

  return (
    <div className="lk-form-row">
      <div className="lk-form-label-row">
        <label className={cn('lk-form-label', invalid && 'lk-error')} htmlFor={rest.id}>
          {label}
        </label>
      </div>
      {input}
    </div>
  );
}

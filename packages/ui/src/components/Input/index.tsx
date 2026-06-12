'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '../../cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Renders the error/invalid styling (`lk-invalid`) and sets `aria-invalid`. */
  invalid?: boolean;
  className?: string;
}

/** Aurora text input. Controlled or uncontrolled via native `value`/`defaultValue`. */
export default function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      className={cn('lk-input', invalid && 'lk-invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

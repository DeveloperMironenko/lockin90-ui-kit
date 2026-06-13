'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface StandalonePasswordInputProps {
  id: string;
  /** Optional field label rendered above the control. */
  label?: ReactNode;
  /** Controlled value. */
  value: string;
  /** Fires with the raw string value on every change. */
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Renders the error/invalid styling. */
  invalid?: boolean;
  className?: string;
}

/**
 * Aurora password field that owns its own show/hide state — drop it in with just
 * `value`/`onChange` and it manages the reveal toggle internally.
 */
export default function StandalonePasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  invalid,
  className,
}: StandalonePasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="lk-number">
      {label && (
        <label className="lk-form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <span className="lk-password">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn('lk-input', 'lk-password-input', invalid && 'lk-invalid', className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={invalid || undefined}
        />
        <button
          type="button"
          className="lk-password-toggle"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </span>
    </div>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 4.6A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 3.4-.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

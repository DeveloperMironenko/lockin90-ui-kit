'use client';

import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  /** Renders the error/invalid styling (`lk-invalid`) and sets `aria-invalid`. */
  invalid?: boolean;
  /** Back-compat: when given, renders a label above the field. */
  label?: ReactNode;
  /**
   * Back-compat: controlled visibility. When BOTH `show` and `onToggle` are
   * provided, reveal state is owned by the parent; otherwise the component
   * manages it internally.
   */
  show?: boolean;
  /** Back-compat: called when the eye button is pressed (controlled mode). */
  onToggle?: () => void;
  className?: string;
}

/**
 * Aurora password field — visually identical to `Input`, plus a show/hide eye
 * toggle inside the field on the right. The component owns `type`
 * (`password`/`text`); reveal state is internal and starts hidden unless
 * controlled via `show`/`onToggle`.
 */
export default function PasswordInput({
  invalid,
  label,
  show,
  onToggle,
  className,
  disabled,
  ...rest
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const controlled = show !== undefined && onToggle !== undefined;
  const visible = controlled ? show : internalVisible;

  function toggle() {
    if (controlled) onToggle();
    else setInternalVisible((v) => !v);
  }

  const field = (
    <span className="lk-password">
      <input
        type={visible ? 'text' : 'password'}
        className={cn('lk-input', 'lk-password-input', invalid && 'lk-invalid', className)}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...rest}
      />
      <button
        type="button"
        className="lk-password-toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </span>
  );

  if (label == null) return field;

  return (
    <div className="lk-form-row">
      <div className="lk-form-label-row">
        <label className={cn('lk-form-label', invalid && 'lk-error')} htmlFor={rest.id}>
          {label}
        </label>
      </div>
      {field}
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

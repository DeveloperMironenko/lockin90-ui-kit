'use client';

import { useState } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';
import type { InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'unit'> {
  /** start with the password revealed @default false */
  defaultVisible?: boolean;
  /** accessibility label for the show/hide toggle
   *  (default "Show password" / "Hide password") */
  toggleLabel?: string;
}

/**
 * PasswordInput — a password text field with a built-in show/hide eye toggle.
 * Mirrors `Input` (same `label` / `leading` / `invalid` / `inputSize` + glass
 * shell); `type` is owned internally and flipped by the trailing eye button.
 */
export function PasswordInput({
  label,
  invalid = false,
  inputSize = 'md',
  leading,
  defaultVisible = false,
  toggleLabel,
  className,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(defaultVisible);
  const aria = toggleLabel ?? (visible ? 'Hide password' : 'Show password');

  return (
    <label className="lk-input-wrap">
      {label ? <span className="lk-input-label">{label}</span> : null}
      <span className={cn('lk-input-field', inputSize === 'sm' && 'lk-input-sm', invalid && 'lk-input-invalid')}>
        {leading ? <span className="lk-input-lead">{leading}</span> : null}
        <input
          className={cn('lk-input', className)}
          type={visible ? 'text' : 'password'}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        <button
          type="button"
          className="lk-input-trail"
          aria-label={aria}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </span>
    </label>
  );
}

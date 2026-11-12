'use client';

import { forwardRef, useState } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';
import type { InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'unit'> {
  /** start with the password revealed @default false */
  defaultVisible?: boolean;
  /** accessibility label of the toggle while masked (pass a localized string)
   *  @default 'Show password' */
  showLabel?: string;
  /** accessibility label of the toggle while revealed (pass a localized string)
   *  @default 'Hide password' */
  hideLabel?: string;
}

/**
 * PasswordInput — a password text field with a built-in show/hide eye toggle.
 * Mirrors `Input` (same `label` / `leading` / `invalid` / `inputSize` + glass
 * shell); `type` is owned internally and flipped by the trailing eye button.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    label,
    invalid = false,
    inputSize = 'md',
    leading,
    defaultVisible = false,
    showLabel = 'Show password',
    hideLabel = 'Hide password',
    className,
    ...rest
  },
  ref,
) {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <label className="lk-input-wrap">
      {label ? <span className="lk-input-label">{label}</span> : null}
      <span className={cn('lk-input-field', inputSize === 'sm' && 'lk-input-sm', invalid && 'lk-input-invalid')}>
        {leading ? <span className="lk-input-lead">{leading}</span> : null}
        <input
          ref={ref}
          className={cn('lk-input', className)}
          type={visible ? 'text' : 'password'}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        <button
          type="button"
          className="lk-input-trail"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </span>
    </label>
  );
});

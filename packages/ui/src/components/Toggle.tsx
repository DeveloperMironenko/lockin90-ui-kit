import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** whether the switch is on (default false) */
  checked?: boolean;
  /** fired with the next checked state when toggled */
  onChange?: (checked: boolean) => void;
  /** optional text rendered beside the switch */
  label?: string;
  /** control scale (default 'md') */
  size?: ToggleSize;
  /** when true, the switch is non-interactive and dimmed */
  disabled?: boolean;
}

/** Accessible on/off switch — a glass pill track with a gradient knob that
 *  slides L→R when on (the track lights up with the CTA gradient + glow).
 *  Implemented as a real `<button role="switch">` so keyboard + AT work. An
 *  optional `label` is laid out in a flex row beside the switch. */
export function Toggle({
  checked = false,
  onChange,
  label,
  size = 'md',
  disabled,
  className,
  ...rest
}: ToggleProps) {
  const button = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn('lk-toggle', `lk-toggle-${size}`, checked && 'is-on', label == null && className)}
      onClick={() => onChange?.(!checked)}
      {...rest}
    >
      <span className="lk-toggle-knob" aria-hidden="true" />
    </button>
  );

  if (label == null) return button;

  return (
    <span className={cn('lk-toggle-row', disabled && 'is-disabled', className)}>
      {button}
      <span
        className="lk-toggle-label"
        onClick={() => !disabled && onChange?.(!checked)}
      >
        {label}
      </span>
    </span>
  );
}

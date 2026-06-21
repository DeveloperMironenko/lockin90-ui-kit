import type { InputHTMLAttributes } from 'react';
import { cn } from '../cn';

/* ── shared check glyph ─────────────────────────────────────────────── */
function CheckGlyph() {
  return (
    <svg className="lk-check-tick" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/* ── Checkbox ───────────────────────────────────────────────────────── */
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'checked'> {
  /** controlled checked state */
  checked?: boolean;
  /** show a dash instead of a tick (mixed selection) */
  indeterminate?: boolean;
  /** fires with the next checked value */
  onChange?: (checked: boolean) => void;
  /** text beside the box */
  label?: string;
  disabled?: boolean;
}

/** Custom checkbox — accent-filled box with a tick (or dash when indeterminate). */
export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <label className={cn('lk-check', disabled && 'lk-check-disabled', className)}>
      <input
        type="checkbox"
        className="lk-check-native"
        checked={checked}
        disabled={disabled}
        // `indeterminate` is a DOM property, not an attribute — set it on the node.
        ref={(node) => {
          if (node) node.indeterminate = indeterminate;
        }}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
        {...rest}
      />
      <span className={cn('lk-check-box', indeterminate && 'lk-check-mixed')} aria-hidden="true">
        {indeterminate ? <span className="lk-check-dash" /> : <CheckGlyph />}
      </span>
      {label ? <span className="lk-check-label">{label}</span> : null}
    </label>
  );
}

/* ── Radio ──────────────────────────────────────────────────────────── */
export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'checked'> {
  /** controlled selected state */
  checked?: boolean;
  /** fires with the next checked value */
  onChange?: (checked: boolean) => void;
  /** text beside the dot */
  label?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
}

/** Custom radio — accent dot fills the ring when selected. */
export function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  className,
  ...rest
}: RadioProps) {
  return (
    <label className={cn('lk-radio', disabled && 'lk-radio-disabled', className)}>
      <input
        type="radio"
        className="lk-radio-native"
        checked={checked}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
        {...rest}
      />
      <span className="lk-radio-ring" aria-hidden="true">
        <span className="lk-radio-dot" />
      </span>
      {label ? <span className="lk-radio-label">{label}</span> : null}
    </label>
  );
}

/* ── RadioGroup ─────────────────────────────────────────────────────── */
export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options?: RadioOption[];
  /** currently selected value */
  value?: string;
  /** fires with the chosen option value */
  onChange?: (value: string) => void;
  /** shared input name (grouping) */
  name?: string;
  disabled?: boolean;
  className?: string;
}

/** A vertical column of mutually-exclusive radios. */
export function RadioGroup({
  options = [],
  value,
  onChange,
  name,
  disabled = false,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('lk-radio-group', className)} role="radiogroup">
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          checked={value === opt.value}
          disabled={disabled}
          onChange={(c) => {
            if (c) onChange?.(opt.value);
          }}
        />
      ))}
    </div>
  );
}

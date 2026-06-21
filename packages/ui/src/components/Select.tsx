import type { SelectHTMLAttributes } from 'react';
import { cn } from '../cn';

/** A single option in a {@link Select}. */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  /** options to render; defaults to a few sample options */
  options?: SelectOption[];
  /** controlled selected value */
  value?: string;
  /** fired with the newly selected value */
  onChange?: (value: string) => void;
  /** placeholder rendered as a disabled first option */
  placeholder?: string;
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** red border + glow to signal an invalid value */
  invalid?: boolean;
  /** disable the field */
  disabled?: boolean;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
];

/** Dark glassy native `<select>` — mono label, custom chevron, accent focus glow. */
export function Select({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  placeholder,
  label,
  invalid = false,
  disabled = false,
  className,
  ...rest
}: SelectProps) {
  return (
    <label className="lk-select-wrap">
      {label ? <span className="lk-select-label">{label}</span> : null}
      <span className={cn('lk-select-field', invalid && 'lk-select-invalid', disabled && 'lk-select-disabled')}>
        <select
          className={cn('lk-select', className)}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className="lk-select-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}

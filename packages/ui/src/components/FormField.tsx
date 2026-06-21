import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** small mono uppercase label rendered above the control */
  label?: string;
  /** faint helper text below the control (hidden when `error` is set) */
  help?: ReactNode;
  /** red error text below the control — replaces `help` when present */
  error?: ReactNode;
  /** appends a small accent `*` after the label */
  required?: boolean;
  /** ties the label to the control via `htmlFor` */
  htmlFor?: string;
  /** the form control to wrap */
  children?: ReactNode;
}

/** Labeled form-control wrapper — mono label, the control, then faint help or red error. */
export function FormField({
  label,
  help,
  error,
  required = false,
  htmlFor,
  children,
  className,
  ...rest
}: FormFieldProps) {
  return (
    <div className={cn('lk-field', className)} {...rest}>
      {label ? (
        <label className="lk-field-label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="lk-field-req" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <div className="lk-field-control">{children}</div>
      {error ? (
        <p className="lk-field-error" role="alert">
          <Icon name="info" size={12} className="lk-field-error-icon" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : help ? (
        <p className="lk-field-help">{help}</p>
      ) : null}
    </div>
  );
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** current query value (controlled) */
  value?: string;
  /** fires with the next string value on every keystroke and on clear */
  onChange?: (value: string) => void;
  /** placeholder copy (default 'Search…') */
  placeholder?: string;
  /** invoked by the trailing × clear button (in addition to `onChange('')`) */
  onClear?: () => void;
}

/** Search field — leading magnifier, transparent input, trailing × clear when non-empty. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  onClear,
  className,
  ...rest
}: SearchInputProps) {
  const hasValue = !!value && value.length > 0;

  function clear() {
    onChange?.('');
    onClear?.();
  }

  return (
    <div className={cn('lk-search', className)}>
      <span className="lk-search-lead" aria-hidden="true">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </span>
      <input
        type="search"
        className="lk-search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
      {hasValue ? (
        <button type="button" className="lk-search-clear" aria-label="Clear search" onClick={clear}>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

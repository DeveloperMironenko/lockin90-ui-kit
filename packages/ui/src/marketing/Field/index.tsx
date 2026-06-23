import { cn } from '../../cn';

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
}

export type InputProps = BaseProps & {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

/** Labelled, controlled text input with Aurora glass styling. */
export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  className,
}: InputProps) {
  return (
    <div className={cn('lk-field', className)}>
      <label htmlFor={id} className="lk-field-label">
        {label}
        {required && <span className="lk-field-required"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="lk-input"
      />
    </div>
  );
}

export type TextareaProps = BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

/** Labelled, controlled multi-line input with Aurora glass styling. */
export function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 5,
  className,
}: TextareaProps) {
  return (
    <div className={cn('lk-field', className)}>
      <label htmlFor={id} className="lk-field-label">
        {label}
        {required && <span className="lk-field-required"> *</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="lk-textarea"
      />
    </div>
  );
}

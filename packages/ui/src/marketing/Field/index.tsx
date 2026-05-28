import React from 'react';
import { cn } from '../_cn';

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
}

type InputProps = BaseProps & {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

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
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="ea-input-label">
        {label}
        {required && <span className="text-accent"> *</span>}
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
        className="ea-input"
      />
    </div>
  );
}

type TextareaProps = BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

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
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="ea-input-label">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="ea-input resize-none"
      />
    </div>
  );
}

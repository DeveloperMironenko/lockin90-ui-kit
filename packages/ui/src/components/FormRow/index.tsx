import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface FormRowProps {
  /** Field label, rendered as `<label>` (wire `htmlFor` to the control's id). */
  label?: ReactNode;
  htmlFor?: string;
  /** Helper text shown below the control. Hidden when `error` is set. */
  hint?: ReactNode;
  /** Error message shown below the control (takes precedence over `hint`). */
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Aurora labelled-field wrapper: label, control, then a hint or error line. */
export default function FormRow({ label, htmlFor, hint, error, children, className }: FormRowProps) {
  return (
    <div className={cn('lk-form-row', className)}>
      {label && (
        <label className="lk-form-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="lk-form-hint lk-error">{error}</span>
      ) : hint ? (
        <span className="lk-form-hint">{hint}</span>
      ) : null}
    </div>
  );
}

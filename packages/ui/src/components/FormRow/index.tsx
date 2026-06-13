import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface FormRowProps {
  /** Field label, rendered as `<label>` (wire `htmlFor` to the control's id). */
  label?: ReactNode;
  htmlFor?: string;
  /** Marks the field required — renders a `*` marker after the label. */
  required?: boolean;
  /** Helper text shown below the control. Hidden when `error` is set. */
  hint?: ReactNode;
  /** Error message shown below the control (takes precedence over `hint`). */
  error?: ReactNode;
  /**
   * Back-compat (pre-Aurora): right-aligned value shown next to the label.
   * Useful for read-only "label … value" rows.
   */
  value?: ReactNode;
  /**
   * Back-compat (pre-Aurora): drop the bottom divider/margin (e.g. the last row
   * in a stacked form). Aurora rows have no divider, so this just trims the
   * trailing margin.
   */
  last?: boolean;
  /** Back-compat (pre-Aurora): error/red styling on the label. */
  danger?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Aurora labelled-field wrapper: label, control, then a hint or error line. */
export default function FormRow({
  label,
  htmlFor,
  required,
  hint,
  error,
  value,
  last,
  danger,
  children,
  className,
}: FormRowProps) {
  return (
    <div className={cn('lk-form-row', last && 'lk-form-row-last', className)}>
      {(label || value != null) && (
        <div
          className="lk-form-label-row"
          style={
            value != null
              ? { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }
              : undefined
          }
        >
          {label && (
            <label className={cn('lk-form-label', danger && 'lk-error')} htmlFor={htmlFor}>
              {label}
              {required && (
                <span className="lk-form-required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {value != null && (
            <span className={cn('lk-form-value', 'lk-tnum', danger && 'lk-error')} style={{ textAlign: 'right' }}>
              {value}
            </span>
          )}
        </div>
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

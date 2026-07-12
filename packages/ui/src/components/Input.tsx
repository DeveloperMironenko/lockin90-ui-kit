import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** faint suffix inside the field, right side (e.g. "kg") */
  unit?: string;
  /** red border + glow to signal an invalid value */
  invalid?: boolean;
  /** field density */
  inputSize?: 'sm' | 'md';
  /** optional leading icon inside the field shell */
  leading?: ReactNode;
  /**
   * `'default'` (default) is the standard left-aligned UI-font field.
   * `'numeral'` is the design's large-readout variant (edit-set weight/reps,
   * design `.strow .sv`): 20px bold display-font, centered, tabular-nums,
   * with the field + its `unit` suffix hugging the value as one centered
   * group instead of the unit pinning to the field's far edge.
   */
  variant?: 'default' | 'numeral';
}

/** Dark glassy text input — mono label, faint unit suffix, focus glow. When
 *  `required` is true (inherited from `InputHTMLAttributes`), an accent-colored
 *  `*` is appended after the label — matches the `FormField` required marker
 *  so required-field affordances look identical across both wrappers. */
export function Input({
  label,
  unit,
  invalid = false,
  inputSize = 'md',
  leading,
  variant = 'default',
  className,
  ...rest
}: InputProps) {
  const numeral = variant === 'numeral';
  return (
    <label className="lk-input-wrap">
      {label ? (
        <span className="lk-input-label">
          {label}
          {rest.required ? (
            <span className="lk-field-req" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <span
        className={cn(
          'lk-input-field',
          inputSize === 'sm' && 'lk-input-sm',
          invalid && 'lk-input-invalid',
          numeral && 'lk-input-numeral',
        )}
      >
        {leading ? <span className="lk-input-lead">{leading}</span> : null}
        <input className={cn('lk-input', className)} aria-invalid={invalid || undefined} {...rest} />
        {unit ? <span className="lk-input-unit">{unit}</span> : null}
      </span>
    </label>
  );
}

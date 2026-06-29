import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface StateLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Numeric or short alphanumeric badge, e.g. `"01"`. Rendered mono, accent-2 color. */
  num: string;
  /** Section name, e.g. `"Sign in"`. Rendered mono uppercase, faint. */
  label: string;
}

/** StateLabel — numbered section header: mono numeral chip + uppercase label +
 *  hairline gradient rule. Used on auth screen sections
 *  (`01 ────── SIGN IN ──────`). Pure presentational atom. */
export const StateLabel = forwardRef<HTMLDivElement, StateLabelProps>(function StateLabel(
  { num, label, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('lk-statelabel', className)} {...rest}>
      <span className="lk-statelabel-num">{num}</span>
      <span className="lk-statelabel-lbl">{label}</span>
      <span className="lk-statelabel-ln" aria-hidden="true" />
    </div>
  );
});

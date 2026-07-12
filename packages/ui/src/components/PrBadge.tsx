import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type PrBadgeSize = 'sm' | 'md';

export interface PrBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge text (default `'PR'` — also `'NEW'`, `'AT PEAK'`, …). */
  label?: string;
  /** `md` (default) on cards/callouts; `sm` inside dense set rows. */
  size?: PrBadgeSize;
}

/**
 * PrBadge — the solid RED personal-record flag. A deliberate break from the
 * Aurora spectrum: PR red `#FF4757` is the one off-palette signal color in the
 * training design (a PR must scream), rendered as a tight 4px-radius tab with
 * white bold mono text + a soft red glow. `SetTable` stamps it on PR'd done
 * sets; `PrCard` uses it as the `new` / `atPeak` state tag.
 */
export const PrBadge = forwardRef<HTMLSpanElement, PrBadgeProps>(function PrBadge(
  { label = 'PR', size = 'md', className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn('lk-prbadge', size === 'sm' && 'lk-prbadge-sm', className)} {...rest}>
      {label}
    </span>
  );
});

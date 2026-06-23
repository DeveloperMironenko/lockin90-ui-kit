import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Card-art gradient (mirrors the `@lockin90/tokens` gradient tokens). */
export type CardGradient = 'cta' | 'flux' | 'violet' | 'mint' | 'warm';

export interface CreditCardVisualProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** last 4 digits — rendered as `•••• •••• •••• {last4}` */
  last4: string;
  /** cardholder name (uppercased for display) */
  holder?: string;
  /** expiry, `'MM/YY'` */
  expiry?: string;
  /** brand label shown top-right, e.g. `'VISA'` (plain text, not a logo) */
  brand?: string;
  /** card-art gradient @default 'cta' */
  gradient?: CardGradient;
}

/**
 * CreditCardVisual — a credit-card-aspect (≈1.586:1) gradient panel mirroring the
 * `.creditcard` art in the billing mockup: a brand label top-right, a metallic
 * chip glyph, the masked card-number row (mono, letter-spaced) and a bottom row
 * with the cardholder (mono uppercase) + expiry. The chosen `gradient` fills the
 * art behind a subtle sheen. Tokens-driven; native twin lives in
 * `@lockin90/ui-native` with an identical name, props and visuals.
 */
export const CreditCardVisual = forwardRef<HTMLDivElement, CreditCardVisualProps>(
  function CreditCardVisual({ last4, holder, expiry, brand, gradient = 'cta', className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('lk-cc', `lk-cc-${gradient}`, className)}
        aria-label={`Card ending ${last4}${expiry ? `, expires ${expiry}` : ''}`}
        {...rest}
      >
        <div className="lk-cc-sheen" aria-hidden="true" />

        <div className="lk-cc-top">
          <div className="lk-cc-chip" aria-hidden="true" />
          {brand ? <span className="lk-cc-brand">{brand}</span> : null}
        </div>

        <div className="lk-cc-num">{`•••• •••• •••• ${last4}`}</div>

        <div className="lk-cc-bottom">
          <div className="lk-cc-field">
            <div className="lk-cc-lbl">Card holder</div>
            <div className="lk-cc-val">{(holder ?? '').toUpperCase()}</div>
          </div>
          {expiry ? (
            <div className="lk-cc-field lk-cc-field-end">
              <div className="lk-cc-lbl">Expires</div>
              <div className="lk-cc-val">{expiry}</div>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

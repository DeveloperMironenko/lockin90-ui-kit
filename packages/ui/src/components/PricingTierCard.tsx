import { type ReactNode } from 'react';
import { cn } from '../cn';
import { Card } from './Card';
import { Icon } from './Icon';
import { Badge } from './Toast';

/**
 * A single feature row. A plain `string` (or `{ included: true }`) renders a
 * mint check ✓; `{ included: false }` renders a muted cross ✗ (feature not in
 * this tier). Lets one component express both included and excluded features.
 */
export type PricingFeature = string | { label: string; included?: boolean };

export interface PricingTierCardProps {
  /** tier name, e.g. 'Free' | 'Pro' | 'Elite' */
  name: string;
  /** preformatted price, e.g. '$9' or 'Free' */
  price: string;
  /** billing period, e.g. '/mo' */
  period?: string;
  description?: string;
  /**
   * Feature list. A plain string → mint check ✓; an object with
   * `included: false` → a muted cross ✗ (excluded from this tier).
   */
  features: PricingFeature[];
  /** accent/cta-gradient border + glow + a ribbon */
  featured?: boolean;
  /** ribbon copy (only when `featured`) @default 'Most popular' */
  ribbonLabel?: string;
  /** small tier badge label */
  badge?: string;
  /** CTA slot — consumer passes a `<Button>` (renders at the bottom) */
  cta?: ReactNode;
  /** dim + disable the whole card (unavailable / current plan / coming soon) */
  disabled?: boolean;
  className?: string;
}

/**
 * PricingTierCard — a glass plan card: tier name + optional badge, a big price
 * (display font) + period, a description, a feature list each with a leading
 * mint check Icon, and a CTA slot pinned to the bottom. When `featured`, it
 * gains an animated cta-gradient border + accent glow and a ribbon
 * (`ribbonLabel`). Composed from Card + Icon + Badge; mirrors the `.tier` cards
 * in the billing mockup. Native twin: `@lockin90/ui-native`.
 */
export function PricingTierCard({
  name,
  price,
  period,
  description,
  features,
  featured,
  ribbonLabel = 'Most popular',
  badge,
  cta,
  disabled = false,
  className,
}: PricingTierCardProps) {
  return (
    <Card
      hover={!featured && !disabled}
      flat={featured}
      aria-disabled={disabled || undefined}
      className={cn(
        'lk-tier',
        featured && 'lk-tier-featured',
        disabled && 'lk-tier--disabled',
        className,
      )}
    >
      {featured && <span className="lk-tier-ribbon">{ribbonLabel}</span>}

      <div className="lk-tier-head">
        <span className="lk-tier-name">{name}</span>
        {badge && <Badge tone="accent">{badge}</Badge>}
      </div>

      {description && <p className="lk-tier-desc">{description}</p>}

      <div className="lk-tier-price">
        <span className="lk-tier-amt">{price}</span>
        {period && <span className="lk-tier-per">{period}</span>}
      </div>

      <ul className="lk-tier-feat">
        {features.map((f, i) => {
          const label = typeof f === 'string' ? f : f.label;
          const included = typeof f === 'string' ? true : f.included !== false;
          return (
            <li key={`${label}-${i}`} className={cn(!included && 'lk-tier-feat--off')}>
              <span className={cn('lk-tier-check', !included && 'lk-tier-cross')}>
                <Icon name={included ? 'check' : 'close'} size={16} />
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>

      {cta && <div className="lk-tier-cta">{cta}</div>}
    </Card>
  );
}

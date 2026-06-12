import type { CSSProperties, ReactNode } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export interface PricingCardProps {
  /** Tier name, e.g. "Pro". */
  name: ReactNode;
  /** Big amount, e.g. "$19". */
  price: ReactNode;
  /** Trailing period, e.g. "/mo". */
  period?: ReactNode;
  /** Short tier blurb. */
  description?: ReactNode;
  /** Feature bullet list. */
  features: Array<string>;
  /** Call-to-action — pass a <Button block />. */
  cta?: ReactNode;
  /** Featured tier — gradient border, glow, and "Most popular" badge. */
  popular?: boolean;
  className?: string;
}

/** A marketing pricing tier card. Featured (`popular`) variant lights up + badges. */
export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular = false,
  className,
}: PricingCardProps) {
  const cardStyle: CSSProperties | undefined = popular
    ? { borderColor: 'rgba(124,92,255,.5)', boxShadow: 'var(--glow-accent)' }
    : undefined;

  return (
    <Card lit={popular} className={cn(className)} style={cardStyle}>
      {popular && (
        <span
          className="lk-mono"
          style={{
            position: 'relative',
            display: 'inline-block',
            color: 'var(--accent-2)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            marginBottom: 10,
          }}
        >
          Most popular
        </span>
      )}

      <div className="lk-eyebrow">{name}</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span className="lk-display" style={{ fontSize: 40 }}>
          {price}
        </span>
        {period && (
          <span className="lk-muted lk-mono" style={{ fontSize: 13 }}>
            {period}
          </span>
        )}
      </div>

      {description && (
        <p className="lk-muted" style={{ fontSize: 13.5, marginTop: 8 }}>
          {description}
        </p>
      )}

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '14px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5 }}>
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              stroke="var(--zone-high)"
              strokeWidth={1.6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {cta}
    </Card>
  );
}

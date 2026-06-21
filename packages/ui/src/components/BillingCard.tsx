import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A saved payment card's visual data — brand, masked number tail, holder, expiry. */
export interface BillingPaymentCard {
  /** Network brand, e.g. "VISA". */
  brand: string;
  /** Last four digits — preceding groups render masked. */
  last4: string;
  /** Cardholder name as printed, e.g. "M. KANE". */
  holder: string;
  /** Expiry as printed, e.g. "06 / 27". */
  expiry: string;
}

/** A single plan-quota usage meter row. */
export interface BillingQuota {
  /** Quota label, e.g. "AI insights". */
  label: ReactNode;
  /** Used count this period. */
  used: number;
  /** Allowance for this period. */
  limit: number;
  /** Fill fraction 0..1 (defaults to `used / limit`). */
  pct?: number;
  /** Fill tint — `mint` healthy, `warn` nearing the limit. */
  tone?: 'mint' | 'warn';
  /** Period label, e.g. "this month". */
  period?: ReactNode;
  /** Free-tier note shown bottom-right, e.g. "Free: 5/mo". */
  freeNote?: ReactNode;
  /** Leading glyph; defaults to a per-tone icon. */
  icon?: ReactNode;
}

export interface BillingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section heading. */
  title?: ReactNode;
  /** Plan pill label, e.g. "Pro · $19/mo". */
  plan?: ReactNode;
  /** The saved payment card. */
  card?: BillingPaymentCard;
  /** Plan-quota usage meters. */
  quotas?: BillingQuota[];
}

const SparkleIcon = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent)' }} aria-hidden>
    <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const ImageIcon = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-3)' }} aria-hidden>
    <path d="M3 3h18v18H3zM3 15l5-5 4 4 3-3 6 6" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);

const DEFAULT_CARD: BillingPaymentCard = {
  brand: 'VISA',
  last4: '4242',
  holder: 'M. KANE',
  expiry: '06 / 27',
};

const DEFAULT_QUOTAS: BillingQuota[] = [
  { label: 'AI insights', used: 142, limit: 300, pct: 0.47, tone: 'mint', period: 'this month', freeNote: 'Free: 5/mo', icon: SparkleIcon },
  { label: 'Photo scans', used: 88, limit: 100, pct: 0.88, tone: 'warn', period: 'this month', freeNote: 'Free: locked', icon: ImageIcon },
];

/**
 * Billing & usage — a gradient credit-card visual (chip, brand, masked number,
 * holder + expiry) with a plan pill, plus plan-quota usage meters. Reuses the
 * `lk-card`-free section wrapper, `Chip` plan/percent pills and `lk-barfill`
 * meters; renders `lk-bill-*` for its own structure.
 */
export function BillingCard({
  title = 'Payment & quotas',
  plan = 'Pro · $19/mo',
  card = DEFAULT_CARD,
  quotas = DEFAULT_QUOTAS,
  className,
  ...rest
}: BillingCardProps) {
  return (
    <div className={cn('lk-bill', className)} {...rest}>
      <div className="lk-bill-head">
        <span className="lk-bill-ttl">{title}</span>
        <Chip tone="high" dot>
          {plan}
        </Chip>
      </div>

      <div
        className="lk-bill-card"
        aria-label={`${card.brand} ending ${card.last4}, expires ${card.expiry}`}
      >
        <div className="lk-bill-cc-top">
          <div className="lk-bill-cc-chip" aria-hidden />
          <span className="lk-bill-cc-brand">{card.brand}</span>
        </div>
        <div className="lk-bill-cc-num lk-mono">
          •••• &nbsp; •••• &nbsp; •••• &nbsp; {card.last4}
        </div>
        <div className="lk-bill-cc-bottom">
          <div>
            <div className="lk-bill-lbl">Card holder</div>
            <div className="lk-bill-val">{card.holder}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="lk-bill-lbl">Expires</div>
            <div className="lk-bill-val">{card.expiry}</div>
          </div>
        </div>
      </div>

      <div className="lk-bill-quotas">
        {quotas.map((q, i) => {
          const fraction = q.pct ?? (q.limit > 0 ? q.used / q.limit : 0);
          const v = Math.max(0, Math.min(1, fraction));
          const left = Math.max(0, q.limit - q.used);
          const percentLabel = `${Math.round(v * 100)}%`;
          return (
            <div className="lk-bill-quota" key={i}>
              <div className="lk-bill-qtop">
                <div className="lk-bill-qname">
                  {q.icon ?? (q.tone === 'warn' ? ImageIcon : SparkleIcon)} {q.label}
                </div>
                <Chip tone="mid" className="lk-mono lk-tnum">
                  {percentLabel}
                </Chip>
              </div>
              <div className="lk-bill-qfig">
                <span className="lk-tnum">{q.used}</span>{' '}
                <small>
                  / {q.limit} {q.period}
                </small>
              </div>
              <div
                className={cn('lk-barfill is-visible', q.tone === 'warn' ? 'lk-bill-warn' : 'lk-bill-mint')}
                style={{ ['--v']: v } as CSSProperties}
              >
                <i />
              </div>
              <div className="lk-bill-qsub">
                <span>
                  {q.used} used · {left} left
                </span>
                {q.freeNote != null && <span className="lk-bill-cap">{q.freeNote}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

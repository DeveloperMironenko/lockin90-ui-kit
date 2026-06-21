import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface CorrelationItem {
  /** leading factor, e.g. 'Sleep' */
  from?: string;
  /** trailing factor, e.g. 'Next-day energy' */
  to?: string;
  /** R value in [−1, +1] — sign drives positive (mint/cyan) vs negative (warm) styling */
  r: number;
  /** plain-language read of the relationship; ReactNode so consumers can pass <b>…</b> emphasis */
  read?: ReactNode;
  /** confidence percent 0..100 shown as a tone-coded chip */
  confidence?: number;
  /** number of days the relationship was observed across */
  days?: number;
  /** two normalized spark series (each 0..1, low→high), drawn as the dual line */
  series?: { a?: number[]; b?: number[] };
}

export interface CorrelationCalloutProps extends HTMLAttributes<HTMLDivElement> {
  /** one or more discovered relationships, laid out in a responsive 2-up grid */
  items?: CorrelationItem[];
}

const SW = 78;
const SH = 36;

/** Strength word for |R|. */
function strengthLabel(abs: number): string {
  if (abs >= 0.7) return 'strong';
  if (abs >= 0.4) return 'moderate';
  if (abs >= 0.2) return 'weak';
  return 'negligible';
}

/** Format R with explicit sign and 2 decimals, e.g. +0.82 / −0.64. */
function formatR(r: number): string {
  const sign = r < 0 ? '−' : '+';
  return `${sign}${Math.abs(r).toFixed(2)}`;
}

/** Confidence chip tone bands. */
function confTone(c: number): 'high' | 'mid' | 'low' {
  if (c >= 85) return 'high';
  if (c >= 65) return 'mid';
  return 'low';
}

/** Build an SVG polyline `d` from a normalized series (values 0..1, where 1 = top). */
function sparkPath(series: number[]): string {
  if (series.length === 0) return '';
  const stepX = SW / (series.length - 1 || 1);
  const pad = 8;
  return series
    .map((v, i) => {
      const x = i * stepX;
      const y = SH - pad - Math.max(0, Math.min(1, v)) * (SH - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(0)},${y.toFixed(0)}`;
    })
    .join(' ');
}

const DEFAULT_ITEMS: CorrelationItem[] = [
  {
    from: 'Sleep',
    to: 'Next-day energy',
    r: 0.82,
    read: (
      <>
        When <b>sleep</b> runs longer and deeper, <b>next-day energy</b> reliably climbs with it — a{' '}
        <b>strong positive</b> link worth protecting.
      </>
    ),
    confidence: 92,
    days: 38,
    series: { a: [0.28, 0.39, 0.33, 0.58, 0.69, 0.78], b: [0.22, 0.31, 0.28, 0.5, 0.64, 0.69] },
  },
  {
    from: 'Late caffeine',
    to: 'Deep sleep',
    r: -0.64,
    read: (
      <>
        The later you take <b>caffeine</b>, the less <b>deep sleep</b> you bank that night — a{' '}
        <b>moderate negative</b> link to watch after 2pm.
      </>
    ),
    confidence: 78,
    days: 31,
    series: { a: [0.72, 0.64, 0.75, 0.5, 0.33, 0.22], b: [0.28, 0.39, 0.25, 0.58, 0.69, 0.75] },
  },
];

/** CorrelationCallout — discovered-relationship cards. Each item shows the factor
 *  pair, an R-strength gauge (−1→+1 with a marker), a plain-language read, a
 *  dual-line spark of the two series, and a confidence note. Positive links read
 *  mint/cyan, negative links read warm. Renders the showcase pair by default. */
export function CorrelationCallout({ items = DEFAULT_ITEMS, className, ...rest }: CorrelationCalloutProps) {
  return (
    <div className={cn('lk-corr-grid', className)} {...rest}>
      {items.map((it, idx) => {
        const neg = it.r < 0;
        const abs = Math.min(1, Math.abs(it.r));
        const center = 50;
        // map R∈[−1,+1] onto the track 0%..100%
        const markerPct = ((it.r + 1) / 2) * 100;
        const fillWidthPct = Math.abs(markerPct - center);
        const fillLeftPct = neg ? markerPct : center;

        const posLine = neg ? 'var(--zone-mid)' : 'var(--accent-2)';
        const negLine = neg ? 'var(--cyan)' : 'var(--mint)';
        const seriesA = it.series?.a ?? [];
        const seriesB = it.series?.b ?? [];

        return (
          <article key={idx} className={cn('lk-card', 'lk-corr-card', neg ? 'lk-corr-neg' : 'lk-corr-pos')}>
            <div className="lk-corr-top">
              <div className="lk-corr-pair">
                {it.from && <span className="lk-corr-factor">{it.from}</span>}
                <span className="lk-corr-link" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={neg ? 'M7 7l10 10M9 17h8V9' : 'M7 17l10-10M9 7h8v8'} />
                  </svg>
                </span>
                {it.to && <span className="lk-corr-factor">{it.to}</span>}
              </div>
              {it.confidence != null && (
                <Chip tone={confTone(it.confidence)} dot>
                  <span className="lk-tnum">{it.confidence}%</span> conf.
                </Chip>
              )}
            </div>

            <div className="lk-corr-body">
              <div className={cn('lk-corr-rval', 'lk-display', 'lk-tnum', neg && 'lk-corr-warm')}>{formatR(it.r)}</div>
              {it.read && <p className="lk-corr-interp">{it.read}</p>}
            </div>

            <div className="lk-corr-gauge">
              <div className="lk-corr-glabel">
                <span className="lk-corr-gname lk-mono">Correlation strength</span>
                <span className="lk-corr-gstrength lk-mono">
                  R = {formatR(it.r)} · {strengthLabel(abs)}
                </span>
              </div>
              <div className="lk-corr-track">
                <span
                  className={cn('lk-corr-fill', neg && 'lk-corr-fneg')}
                  style={{ left: `${fillLeftPct}%`, width: `${fillWidthPct}%` }}
                />
                <span className={cn('lk-corr-marker', neg && 'lk-corr-mneg')} style={{ left: `${markerPct}%` }} />
              </div>
              <div className="lk-corr-scale lk-mono">
                <span>{'−'}1.0</span>
                <span>0</span>
                <span>+1.0</span>
              </div>
            </div>

            <div className="lk-corr-foot">
              <div className="lk-corr-viz">
                <svg className="lk-corr-spark" viewBox={`0 0 ${SW} ${SH}`} preserveAspectRatio="none" aria-hidden="true">
                  {seriesA.length > 0 && (
                    <path d={sparkPath(seriesA)} fill="none" stroke={posLine} strokeWidth={2} strokeLinecap="round" />
                  )}
                  {seriesB.length > 0 && (
                    <path
                      d={sparkPath(seriesB)}
                      fill="none"
                      stroke={negLine}
                      strokeWidth={2}
                      strokeLinecap="round"
                      opacity={0.85}
                    />
                  )}
                </svg>
                <div className="lk-corr-legend">
                  {it.from && (
                    <span className="lk-corr-leg lk-mono">
                      <i style={{ background: posLine }} />
                      {it.from}
                    </span>
                  )}
                  {it.to && (
                    <span className="lk-corr-leg lk-mono">
                      <i style={{ background: negLine }} />
                      {it.to}
                    </span>
                  )}
                </div>
              </div>
              {it.days != null && (
                <span className="lk-corr-span lk-mono">
                  across <b className="lk-tnum">{it.days}</b> days
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

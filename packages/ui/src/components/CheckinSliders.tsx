import { type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../cn';

/** A fill paint: a single CSS color, or a list of stops for a left→right gradient. */
export type SliderFill = string | string[];

export interface CheckinSlider {
  /** metric name, e.g. "Energy" */
  label: string;
  /** current value, 0..max (default max 100) */
  value: number;
  /** short zone label shown beside the value, e.g. "High" */
  zone: string;
  /** zone color (hex) — drives the value/zone text, thumb ring and fill glow */
  color: string;
  /** the fill paint — a solid color or gradient stops (left→right) */
  fill: SliderFill;
}

export interface CheckinComposite {
  /** big composite number */
  value: number;
  /** trailing tag, e.g. "· High" */
  tag: string;
  /** ring + number color (hex) */
  color: string;
}

export interface CheckinSlidersProps extends HTMLAttributes<HTMLDivElement> {
  /** card title */
  title?: string;
  /** small timestamp / context line */
  timestamp?: string;
  /** the stacked sliders */
  sliders?: CheckinSlider[];
  /** the composite readout */
  composite?: CheckinComposite;
  /** scale maximum (value/max → fill %) */
  max?: number;
  /** CTA label */
  ctaLabel?: string;
}

/** Faithful reproduction of the design's check-in example. */
const DEFAULT_SLIDERS: CheckinSlider[] = [
  { label: 'Energy', value: 72, zone: 'High', color: 'var(--zone-high)', fill: 'var(--grad-mint)' },
  { label: 'Mood', value: 64, zone: 'Good', color: 'var(--cyan)', fill: ['var(--accent)', 'var(--cyan)'] },
  { label: 'Focus', value: 81, zone: 'Sharp', color: 'var(--accent)', fill: ['var(--magenta)', 'var(--accent)'] },
];

const DEFAULT_COMPOSITE: CheckinComposite = { value: 72, tag: '· High', color: 'var(--zone-high)' };

/* composite ring geometry (46x46 viewBox, r=19) */
const RING_R = 19;
const RING_CIRC = 2 * Math.PI * RING_R; // 119.38

/** Turn a fill paint into a CSS `background` value. */
function fillToBackground(fill: SliderFill): string {
  if (Array.isArray(fill)) return `linear-gradient(90deg, ${fill.join(', ')})`;
  return fill;
}

/** Check-in sliders — a daily self-report card of stacked zone-gradient sliders
 *  (read-only, value-driven fills), a composite readout with a mini ring, and a
 *  gradient "Log check-in" CTA. */
export function CheckinSliders({
  title = 'How are you right now?',
  timestamp = 'Wed · 9:42am',
  sliders = DEFAULT_SLIDERS,
  composite = DEFAULT_COMPOSITE,
  max = 100,
  ctaLabel = 'Log check-in',
  className,
  ...rest
}: CheckinSlidersProps) {
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  const ringOffset = (RING_CIRC * (1 - Math.max(0, Math.min(1, composite.value / max)))).toFixed(1);

  return (
    <div className={cn('lk-sl', 'lk-sl-card', 'lk-card', className)} {...rest}>
      <div className="lk-sl-head">
        <span className="lk-sl-title">{title}</span>
        <span className="lk-sl-sub">{timestamp}</span>
      </div>

      <div className="lk-sl-trio">
        {sliders.map((s) => {
          const cellStyle = {
            '--zcol': s.color,
            '--zfill': fillToBackground(s.fill),
            '--v': pct(s.value),
          } as CSSProperties;
          return (
            <div className="lk-sl-cell" key={s.label} style={cellStyle}>
              <div className="lk-sl-row">
                <span className="lk-sl-name">{s.label}</span>
                <span className="lk-sl-meta">
                  <span className="lk-sl-zone">{s.zone}</span>
                  <span className="lk-sl-val lk-tnum lk-mono">{s.value}</span>
                </span>
              </div>
              <div className="lk-sl-wrap">
                <span className="lk-sl-track" aria-hidden="true" />
                <span className="lk-sl-fill" />
                <span className="lk-sl-thumb" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="lk-sl-comp">
        <div className="lk-sl-comp-l">
          <span className="lk-sl-comp-k">Today&apos;s composite</span>
          <span className="lk-sl-comp-v">
            <span className="lk-sl-comp-num lk-display lk-tnum" style={{ color: composite.color }}>
              {composite.value}
            </span>
            <span className="lk-sl-comp-tag" style={{ color: composite.color }}>
              {composite.tag}
            </span>
          </span>
        </div>
        <svg className="lk-sl-ring" viewBox="0 0 46 46" aria-hidden="true">
          <circle cx="23" cy="23" r={RING_R} fill="none" stroke="var(--border-2)" strokeWidth="5" />
          <circle
            cx="23"
            cy="23"
            r={RING_R}
            fill="none"
            stroke={composite.color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC.toFixed(1)}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 23 23)"
          />
        </svg>
      </div>

      <button className="lk-btn lk-btn-primary lk-sl-btn" type="button">
        {ctaLabel}
      </button>
    </div>
  );
}

export type { CheckinSlider as CheckinSlidersSlider, CheckinComposite as CheckinSlidersComposite };

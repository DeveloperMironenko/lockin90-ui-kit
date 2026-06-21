import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Where the measured value sits relative to its optimal band. */
export type BiomarkerStatus = 'optimal' | 'warn' | 'out';
/** Direction of the recent trend. */
export type BiomarkerTrend = 'up' | 'down' | 'flat';

export interface BiomarkerRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Biomarker name, e.g. "HDL cholesterol". */
  name?: string;
  /** Mono subtitle under the name, e.g. "Lipid panel · cardio". */
  subtitle?: string;
  /** Measured value (drives the value text and the marker position). */
  value?: number;
  /** Unit label, e.g. "mg/dL". */
  unit?: string;
  /** Status of the value — colors the value text and the range marker. */
  status?: BiomarkerStatus;
  /** Scale minimum (left edge of the range track). */
  min?: number;
  /** Scale maximum (right edge of the range track). */
  max?: number;
  /** Low end of the optimal band, in value units. */
  optimalLow?: number;
  /** High end of the optimal band, in value units. */
  optimalHigh?: number;
  /** Trend direction — colors and shapes the trend chip + spark. */
  trend?: BiomarkerTrend;
  /** Trend delta label, e.g. "+7". */
  delta?: string;
}

/** Map a 0..1 fraction across [min,max] to a clamped percentage string. */
function pct(value: number, min: number, max: number): string {
  if (max <= min) return '0%';
  const frac = (value - min) / (max - min);
  return `${Math.max(0, Math.min(1, frac)) * 100}%`;
}

/** Sparkline path + glyph per trend direction. */
const TREND: Record<BiomarkerTrend, { path: string; stroke: string; cls: string; glyph: string }> = {
  up: { path: 'M0,18 L19,16 L39,12 L58,9 L78,6', stroke: 'var(--zone-high)', cls: 'lk-bio-up', glyph: '▲' },
  down: { path: 'M0,8 L19,11 L39,10 L58,13 L78,15', stroke: 'var(--zone-low)', cls: 'lk-bio-down', glyph: '▼' },
  flat: { path: 'M0,13 L19,12 L39,13 L58,12 L78,13', stroke: 'var(--text-faint)', cls: 'lk-bio-flat', glyph: '—' },
};

const STATUS_VALUE: Record<BiomarkerStatus, string> = { optimal: '', warn: 'lk-bio-warn', out: 'lk-bio-flag' };
const STATUS_MARKER: Record<BiomarkerStatus, string> = { optimal: '', warn: 'lk-bio-warn', out: 'lk-bio-out' };

/**
 * Lab biomarker row: name + status-colored value/unit, a low/optimal/high
 * reference band with a positioned value marker, and a trend chip. Wrap a set
 * of these in `<div className="lk-bio">` (optionally with a `BiomarkerGroupHead`).
 */
export function BiomarkerRow({
  name = 'HDL cholesterol',
  subtitle = 'Lipid panel · cardio',
  value = 62,
  unit = 'mg/dL',
  status = 'optimal',
  min = 30,
  max = 100,
  optimalLow = 40,
  optimalHigh = 90,
  trend = 'up',
  delta = '+7',
  className,
  ...rest
}: BiomarkerRowProps) {
  const t = TREND[trend];
  const rangeStyle = {
    '--low': pct(optimalLow, min, max),
    '--high': pct(optimalHigh, min, max),
    '--pos': pct(value, min, max),
  } as CSSProperties;

  return (
    <div className={cn('lk-bio-row', className)} {...rest}>
      <div className="lk-bio-name">
        {name}
        {subtitle && <div className="lk-bio-bsub">{subtitle}</div>}
      </div>

      <div className="lk-bio-val">
        <span className={cn('lk-bio-v', 'lk-display', 'lk-tnum', STATUS_VALUE[status])}>{value}</span>
        <span className="lk-bio-u lk-mono">{unit}</span>
      </div>

      <div className="lk-bio-range" style={rangeStyle}>
        <div className="lk-bio-range-track">
          <div className="lk-bio-range-band" />
          <div className={cn('lk-bio-range-marker', STATUS_MARKER[status])} aria-hidden="true" />
        </div>
        <div className="lk-bio-range-scale lk-mono">
          <span className="lk-tnum">{min}</span>
          <span className="lk-bio-opt">optimal</span>
          <span className="lk-tnum">{max}</span>
        </div>
      </div>

      <div className="lk-bio-trend">
        <svg viewBox="0 0 78 26" preserveAspectRatio="none" aria-hidden="true">
          <path d={t.path} fill="none" stroke={t.stroke} strokeWidth={2} strokeLinecap="round" />
        </svg>
        {delta && (
          <span className={cn('lk-bio-td', 'lk-mono', 'lk-tnum', t.cls)}>
            {t.glyph} {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export interface BiomarkerGroupHeadProps extends HTMLAttributes<HTMLDivElement> {
  /** Panel / group title, e.g. "Metabolic". */
  title?: string;
  /** Mono count summary, e.g. "4 markers · 2 flagged". */
  count?: string;
}

/** Optional header above a set of `BiomarkerRow`s — pulse icon + title + count. */
export function BiomarkerGroupHead({
  title = 'Metabolic',
  count = '4 markers · 2 flagged',
  className,
  ...rest
}: BiomarkerGroupHeadProps) {
  return (
    <div className={cn('lk-bio-group-head', className)} {...rest}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
      <h4>{title}</h4>
      {count && <span className="lk-bio-gcount">{count}</span>}
    </div>
  );
}

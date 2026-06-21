import { useId, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** One of the three readout stats under the curve. */
export interface GlycemicStat {
  /** mono uppercase label, e.g. "Peak" */
  label: string;
  /** big display value, e.g. "+42" */
  value: string;
  /** optional small unit appended to the value, e.g. "mg/dL" */
  unit?: string;
  /** mono caption under the value, e.g. "over baseline" */
  detail?: string;
  /** tones the caption: mid = amber, low = red (= "good"/clean return here) */
  detailTone?: 'mid' | 'low';
}

export interface GlycemicCurveProps extends HTMLAttributes<HTMLDivElement> {
  /** display title, e.g. the meal name */
  title?: string;
  /** mono uppercase eyebrow under the title */
  subtitle?: string;
  /** trailing tone chip label, e.g. "moderate" */
  chipLabel?: string;
  /** tone of the trailing chip */
  chipTone?: ChipTone;
  /**
   * Glucose curve as an SVG path string in the 280×120 viewBox (baseline at
   * y=88). The matching area fill is derived by closing this path to the floor.
   */
  linePath?: string;
  /** y of the dashed baseline line, in viewBox units (default 88) */
  baselineY?: number;
  /** peak marker position in viewBox units */
  peak?: { x: number; y: number; label: string };
  /** time-axis ticks under the chart */
  axis?: string[];
  /** the three readout stats */
  stats?: [GlycemicStat, GlycemicStat, GlycemicStat] | GlycemicStat[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

const VB_W = 280;
const VB_H = 120;

/** Faithful reproduction of the design's "Chicken & rice bowl" example. */
const DEFAULT_LINE = 'M0,88 L26,84 L52,58 L78,30 L104,40 L132,54 L160,70 L190,82 L222,87 L280,88';
const DEFAULT_PEAK = { x: 78, y: 30, label: '+42' };
const DEFAULT_AXIS = ['0', '+30m', '+1h', '+2h'];
const DEFAULT_STATS: GlycemicStat[] = [
  { label: 'Peak', value: '+42', unit: 'mg/dL', detail: 'over baseline', detailTone: 'mid' },
  { label: 'Glycemic load', value: '21', detail: 'moderate', detailTone: 'mid' },
  { label: 'To baseline', value: '1h 50m', detail: 'clean return', detailTone: 'low' },
];
const DEFAULT_ARIA = 'Glucose response: +42 peak ~45min, back to baseline by 1h50m.';

/** Vertical guide lines inside the chart (in viewBox x units). */
const GUIDES = [70, 140, 210];

/** Glycemic curve — a post-meal blood-glucose response area chart (rise to a
 *  peak then back to baseline) with a dashed baseline, a peak marker, a time
 *  axis and a 3-stat readout row (peak / glycemic load / time-to-baseline)
 *  plus a tone chip. */
export function GlycemicCurve({
  title = 'Chicken & rice bowl',
  subtitle = 'glucose response · 2h',
  chipLabel = 'moderate',
  chipTone = 'mid',
  linePath = DEFAULT_LINE,
  baselineY = 88,
  peak = DEFAULT_PEAK,
  axis = DEFAULT_AXIS,
  stats = DEFAULT_STATS,
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: GlycemicCurveProps) {
  const uid = useId();
  const strokeId = `lk-gl-stroke-${uid}`;
  const fillId = `lk-gl-fill-${uid}`;
  // close the line down to the floor for the gradient area fill
  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <div className={cn('lk-gl', 'lk-card', className)} {...rest}>
      <div className="lk-gl-top">
        <div className="lk-gl-head">
          <span className="lk-gl-ttl">{title}</span>
          {subtitle && <span className="lk-gl-sub">{subtitle}</span>}
        </div>
        {chipLabel && <Chip tone={chipTone}>{chipLabel}</Chip>}
      </div>

      <div className="lk-gl-chart">
        <svg className="lk-gl-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
          <defs>
            <linearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0">
              <stop offset="0" stopColor="#22D3EE" />
              <stop offset=".4" stopColor="#FFB020" />
              <stop offset=".62" stopColor="#FFB020" />
              <stop offset="1" stopColor="#34F5C5" />
            </linearGradient>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H}>
              <stop offset="0" stopColor="rgba(255,176,32,.30)" />
              <stop offset=".55" stopColor="rgba(34,211,238,.12)" />
              <stop offset="1" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>

          {/* dashed baseline */}
          <line x1="0" y1={baselineY} x2={VB_W} y2={baselineY} stroke="rgba(52,245,197,.30)" strokeWidth="1" strokeDasharray="4 5" />
          {/* vertical guides */}
          {GUIDES.map((gx) => (
            <line key={gx} x1={gx} y1="8" x2={gx} y2="100" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 5" />
          ))}

          {/* gradient area + glowing line */}
          <path d={areaPath} fill={`url(#${fillId})`} opacity=".9" />
          <path
            className="lk-gl-line"
            d={linePath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* peak marker: guide line + dot + label */}
          {peak && (
            <>
              <line x1={peak.x} y1={peak.y - 8} x2={peak.x} y2="100" stroke="rgba(255,176,32,.4)" strokeWidth="1.1" strokeDasharray="2 4" />
              <circle className="lk-gl-peakdot" cx={peak.x} cy={peak.y} r="3.8" fill="#FFB020" stroke="#0C0F1A" strokeWidth="2" />
              <text className="lk-gl-peaklbl" x={peak.x + 6} y={peak.y - 8}>
                {peak.label}
              </text>
            </>
          )}
        </svg>

        <div className="lk-gl-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="lk-gl-stats">
        {stats.map((s, i) => (
          <div className="lk-gl-stat" key={i}>
            <div className="lk-gl-l">{s.label}</div>
            <div className="lk-gl-v lk-mono lk-tnum">
              {s.value}
              {s.unit && <span className="lk-gl-u">{s.unit}</span>}
            </div>
            {s.detail && (
              <div className={cn('lk-gl-d', s.detailTone === 'low' ? 'lk-gl-low' : s.detailTone === 'mid' ? 'lk-gl-mid' : undefined)}>
                {s.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

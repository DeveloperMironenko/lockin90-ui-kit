import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** A chip shown in the pay-it-back footer. */
export interface SleepDebtChip {
  label: string;
  tone?: ChipTone;
}

export interface SleepDebtChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** display title, e.g. "Sleep · last 14 days" */
  title?: ReactNode;
  /** mono sub-eyebrow under the title, e.g. "hours slept vs need" */
  sub?: ReactNode;
  /** big cumulative-debt readout, e.g. "−4.2 h" */
  debt?: ReactNode;
  /** mono label under the readout, e.g. "cumulative debt" */
  debtLabel?: ReactNode;
  /** hours slept per night, oldest → newest (newest is "today") */
  nights?: number[];
  /** the nightly sleep target in hours (drives the dashed need line) */
  need?: number;
  /** weekday ticks under the chart (spread evenly) */
  axis?: string[];
  /** pay-it-back footer copy (rich node, may include <b>) */
  footer?: ReactNode;
  /** chips on the right of the footer */
  chips?: SleepDebtChip[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

/** chart viewBox + the hours window the y-axis spans (top = HOURS_MAX, bottom = HOURS_MIN) */
const VB_W = 620;
const VB_H = 156;
const PLOT_TOP = 21; // y of HOURS_MAX
const PLOT_BOTTOM = 138; // y of HOURS_MIN
const HOURS_MAX = 9;
const HOURS_MIN = 4.5;

/** y-axis gridlines + labels (hours → y is derived) */
const Y_TICKS = [9, 7.5, 6, 4.5];

/** Faithful reproduction of the design's "Sleep · last 14 days" example. */
const DEFAULT_NIGHTS = [7.8, 7.2, 7.6, 6.7, 7.0, 6.3, 7.3, 6.1, 6.6, 5.9, 6.9, 5.6, 6.2, 5.3];
const DEFAULT_AXIS = ['Mon', 'Wed', 'Fri', 'Sun', 'Tue', 'Thu', 'Sat'];
const DEFAULT_CHIPS: SleepDebtChip[] = [
  { label: '−4.2 h debt', tone: 'mid' },
  { label: '▼ trending down', tone: 'low' },
];
const DEFAULT_ARIA = '14-night sleep trend below the 7.5h need line, −4.2h debt.';

/** map a sleep-hours value to its y in the chart viewBox */
function hoursToY(h: number): number {
  const frac = (h - HOURS_MIN) / (HOURS_MAX - HOURS_MIN);
  return +(PLOT_BOTTOM - frac * (PLOT_BOTTOM - PLOT_TOP)).toFixed(2);
}

/** evenly spaced x for the i-th of n points across the full width */
function xAt(i: number, n: number): number {
  if (n <= 1) return 0;
  return +((i / (n - 1)) * VB_W).toFixed(2);
}

/**
 * Sleep-debt trend — a 14-night sleep-hours gradient area chart drawn in SVG
 * against a dashed "need 7.5h" target line, with a cumulative-debt readout, a
 * today divider on the newest night, weekday x labels, a legend and a
 * pay-it-back footer with chips. Defaults reproduce the design example.
 */
export function SleepDebtChart({
  title = 'Sleep · last 14 days',
  sub = 'hours slept vs need',
  debt = '−4.2 h',
  debtLabel = 'cumulative debt',
  nights = DEFAULT_NIGHTS,
  need = 7.5,
  axis = DEFAULT_AXIS,
  footer = (
    <>
      <b>Pay it back:</b> +35m for 4 nights clears it. Debt over <b>4h</b> is when energy reliably drops.
    </>
  ),
  chips = DEFAULT_CHIPS,
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: SleepDebtChartProps) {
  const fillId = useId();
  const strokeId = useId();

  const n = nights.length;
  const points = nights.map((h, i) => ({ x: xAt(i, n), y: hoursToY(h) }));
  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${lineD} L${VB_W},${VB_H} L0,${VB_H} Z`;
  const needY = hoursToY(need);
  const last = points[n - 1];

  return (
    <div className={cn('lk-debt', 'lk-card', className)} {...rest}>
      {/* header: title + sub, cumulative-debt readout */}
      <div className="lk-debt-head">
        <div>
          <div className="lk-debt-title">{title}</div>
          <div className="lk-debt-sub">{sub}</div>
        </div>
        <div className="lk-debt-readout">
          <div className="lk-debt-num lk-tnum">{debt}</div>
          <div className="lk-debt-numlbl">{debtLabel}</div>
        </div>
      </div>

      {/* chart */}
      <svg className="lk-debt-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H}>
            <stop offset="0" stopColor="rgba(34,211,238,.26)" />
            <stop offset="1" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
          <linearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0">
            <stop offset="0" stopColor="#7C5CFF" />
            <stop offset=".5" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#34F5C5" />
          </linearGradient>
        </defs>

        {/* faint horizontal gridlines (skip the need-line row, drawn separately) */}
        <g className="lk-debt-grid">
          {Y_TICKS.filter((h) => h !== need).map((h) => (
            <line key={h} x1="0" y1={hoursToY(h)} x2={VB_W} y2={hoursToY(h)} />
          ))}
        </g>

        {/* y-axis hour labels */}
        <g className="lk-debt-ylbl">
          {Y_TICKS.map((h) => (
            <text key={h} x="2" y={hoursToY(h) - 2}>
              {h}h
            </text>
          ))}
        </g>

        {/* dashed need line */}
        <line className="lk-debt-need" x1="0" y1={needY} x2={VB_W} y2={needY} />
        <text className="lk-debt-needlbl" x={VB_W - 2} y={needY - 4} textAnchor="end">
          NEED {need}h
        </text>

        {/* gradient area + gradient stroke line */}
        <path d={areaD} fill={`url(#${fillId})`} opacity=".9" />
        <path className="lk-debt-line" d={lineD} stroke={`url(#${strokeId})`} />

        {/* today divider + dot on the newest night */}
        <line className="lk-debt-divider" x1={last.x} y1="6" x2={last.x} y2={VB_H - 10} />
        <text className="lk-debt-todaylbl" x={last.x - 4} y="14" textAnchor="end">
          TODAY
        </text>
        <circle className="lk-debt-dot" cx={last.x} cy={last.y} r="4" />
      </svg>

      {/* weekday x axis */}
      <div className="lk-debt-axis">
        {axis.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>

      {/* legend */}
      <div className="lk-debt-legend">
        <span>
          <i style={{ background: 'linear-gradient(90deg,#7C5CFF,#34F5C5)' }} /> Hours slept
        </span>
        <span>
          <i className="lk-debt-dash" /> Need · {need}h
        </span>
      </div>

      {/* pay-it-back footer with chips */}
      <div className="lk-debt-foot">
        <p>{footer}</p>
        <div className="lk-debt-chips">
          {chips.map((c, i) => (
            <Chip key={i} tone={c.tone}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

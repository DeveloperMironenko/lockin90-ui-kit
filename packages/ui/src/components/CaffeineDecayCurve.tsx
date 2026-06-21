import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A point on the concentration curve, in normalized chart space. */
export interface PkSample {
  /** position across the day, 0 (chart start) .. 1 (chart end) */
  x: number;
  /** concentration height, 0 (baseline / bottom) .. 1 (peak / top) */
  y: number;
}

/** A labeled caffeine dose, marked with a dot on the curve. */
export interface PkDose {
  /** position across the day, 0 .. 1 */
  x: number;
  /** concentration height at the dose, 0 .. 1 */
  y: number;
  /** mg label above the dot, e.g. "☕ 130mg" */
  label: string;
  /** time label below the dot, e.g. "7a" */
  time: string;
  /** render the dot in the warning color */
  warn?: boolean;
}

export interface CaffeineDecayCurveProps extends HTMLAttributes<HTMLDivElement> {
  /** substance name shown in the header */
  name?: string;
  /** half-life sub-line, e.g. "5h" */
  halfLife?: string;
  /** dose-count sub-line, e.g. "2 doses today" */
  dosesNote?: string;
  /** header status pill text (omit to hide) */
  status?: string;
  /** the concentration-over-day curve, left→right */
  samples?: PkSample[];
  /** labeled dose markers placed on the curve */
  doses?: PkDose[];
  /** sleep-cutoff vertical line position, 0 .. 1 (omit to hide) */
  cutoff?: number;
  /** label pinned to the cutoff line, e.g. "sleep 11pm" */
  cutoffLabel?: string;
  /** height of the dashed "threshold" horizontal line, 0 .. 1 (omit to hide) */
  threshold?: number;
  /** x-axis time ticks under the chart */
  axis?: string[];
  /** "active at bedtime" amount shown large, e.g. "~48 mg" */
  activeMg?: string;
  /** trailing readout prose after the amount; ReactNode for emphasis */
  readout?: ReactNode;
  /** warn chip at the end of the readout strip, e.g. "−6 sleep pts" */
  warnChip?: string;
  /** accessible description of the chart */
  ariaLabel?: string;
}

/** chart viewBox + the inset the curve is plotted into (matches the design) */
const VB_W = 720;
const VB_H = 168;
/** the curve starts at x=30 and runs to x=720; full height 0..168 */
const PLOT_X0 = 30;
const PLOT_X1 = 720;
/** the three faint horizontal gridlines (as a share of height) */
const GRID_Y = [34 / VB_H, 74 / VB_H, 114 / VB_H];

/** Faithful reproduction of the design's caffeine example.
 *  y values are the design's pixel y mapped to 0 (top) .. 1 (bottom) via 1 - py/168,
 *  i.e. higher concentration = larger y here. */
const DEFAULT_SAMPLES: PkSample[] = [
  { x: 0, y: 1 - 118 / VB_H },
  { x: (70 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 42 / VB_H },
  { x: (110 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 56 / VB_H },
  { x: (150 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 68 / VB_H },
  { x: (190 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 80 / VB_H },
  { x: (230 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 90 / VB_H },
  { x: (270 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 100 / VB_H },
  { x: (310 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 86 / VB_H },
  { x: (350 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 72 / VB_H },
  { x: (390 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 82 / VB_H },
  { x: (430 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 92 / VB_H },
  { x: (470 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 100 / VB_H },
  { x: (510 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 107 / VB_H },
  { x: (550 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 112 / VB_H },
  { x: (590 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 116 / VB_H },
  { x: (630 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 119 / VB_H },
  { x: (660 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 121 / VB_H },
  { x: (690 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 123 / VB_H },
  { x: 1, y: 1 - 124 / VB_H },
];

const DEFAULT_DOSES: PkDose[] = [
  { x: (70 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 42 / VB_H, label: '☕ 130mg', time: '7a' },
  { x: (350 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 72 / VB_H, label: '☕ 95mg', time: '1p' },
];

const DEFAULT_AXIS = ['6a', '12p', '6p', '12a'];

const DEFAULT_READOUT = (
  <>
    {' '}
    active at bedtime · <span className="lk-pk-over">above your 30 mg threshold</span>
  </>
);

const DEFAULT_ARIA = 'Caffeine decay across the day, ~48mg active at the 11pm sleep cutoff.';

/** Map a normalized sample to absolute SVG coordinates within the plot inset. */
function toXY(s: PkSample): { x: number; y: number } {
  return {
    x: PLOT_X0 + s.x * (PLOT_X1 - PLOT_X0),
    y: (1 - s.y) * VB_H,
  };
}

/** Caffeine decay (PK) curve — a pharmacokinetic concentration-over-day chart.
 *  Renders an SVG decay curve (gradient stroke + soft fill), labeled dose dots
 *  positioned over the chart, a dashed sleep-cutoff line + label, a faint
 *  threshold line, x-axis time ticks, a legend, and an "active at bedtime"
 *  readout with a warning chip. Renders the showcase example by default. */
export function CaffeineDecayCurve({
  name = 'Caffeine',
  halfLife = '5h',
  dosesNote = '2 doses today',
  status = 'above threshold',
  samples = DEFAULT_SAMPLES,
  doses = DEFAULT_DOSES,
  cutoff = (630 - PLOT_X0) / (PLOT_X1 - PLOT_X0),
  cutoffLabel = 'sleep 11pm',
  threshold = 1 - 118 / VB_H,
  axis = DEFAULT_AXIS,
  activeMg = '~48 mg',
  readout = DEFAULT_READOUT,
  warnChip = '−6 sleep pts',
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: CaffeineDecayCurveProps) {
  const lineId = useId();
  const fillId = useId();

  const pts = samples.map(toXY);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const first = pts[0];
  const last = pts[pts.length - 1];
  const fill = pts.length
    ? `${line} L${last.x.toFixed(1)},${VB_H} L${first.x.toFixed(1)},${VB_H} Z`
    : '';

  const threshY = threshold != null ? (1 - threshold) * VB_H : null;
  const cutX = cutoff != null ? PLOT_X0 + cutoff * (PLOT_X1 - PLOT_X0) : null;
  /** the cutoff line's left offset as a percent across the whole chart width */
  const cutPct = cutX != null ? (cutX / VB_W) * 100 : null;
  /** concentration y at the cutoff (for the small marker dot) */
  const cutY = threshY ?? VB_H * 0.71;

  return (
    <div className={cn('lk-pk', className)} {...rest}>
      <div className="lk-pk-head">
        <div className="lk-pk-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3" />
          </svg>
          <div>
            <div className="lk-pk-name">{name}</div>
            <div className="lk-pk-half">
              half-life <b>{halfLife}</b> · {dosesNote}
            </div>
          </div>
        </div>
        {status && (
          <Chip tone="mid" dot>
            {status}
          </Chip>
        )}
      </div>

      <div className="lk-pk-wrap">
        <svg className="lk-pk-chart" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
          <defs>
            <linearGradient id={lineId} x1="0" y1="0" x2={VB_W} y2="0">
              <stop offset="0" stopColor="var(--zone-mid)" />
              <stop offset="1" stopColor="var(--zone-low)" />
            </linearGradient>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H}>
              <stop offset="0" stopColor="rgba(255,176,32,0.22)" />
              <stop offset="1" stopColor="rgba(255,176,32,0)" />
            </linearGradient>
          </defs>

          {/* faint horizontal gridlines */}
          <g className="lk-pk-grid">
            {GRID_Y.map((g, i) => (
              <line key={i} x1="0" y1={(g * VB_H).toFixed(1)} x2={VB_W} y2={(g * VB_H).toFixed(1)} />
            ))}
          </g>

          {/* dashed threshold line */}
          {threshY != null && <line className="lk-pk-thresh" x1="0" y1={threshY.toFixed(1)} x2={VB_W} y2={threshY.toFixed(1)} />}

          {/* concentration fill + curve */}
          {fill && <path className="lk-pk-fill" d={fill} fill={`url(#${fillId})`} />}
          {line && <path className="lk-pk-line" d={line} stroke={`url(#${lineId})`} />}

          {/* dose marker dots on the curve */}
          {doses.map((d, i) => {
            const p = toXY(d);
            return (
              <circle
                key={i}
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r="4"
                fill={d.warn ? 'var(--warn)' : 'var(--zone-mid)'}
                stroke="#0c0f1a"
                strokeWidth="2"
              />
            );
          })}

          {/* sleep-cutoff vertical line + the marker where it meets the curve */}
          {cutX != null && (
            <>
              <line className="lk-pk-cut" x1={cutX.toFixed(1)} y1="2" x2={cutX.toFixed(1)} y2="156" />
              <circle cx={cutX.toFixed(1)} cy={cutY.toFixed(1)} r="3.5" fill="var(--zone-low)" stroke="#0c0f1a" strokeWidth="2" />
            </>
          )}
        </svg>

        {/* cutoff label */}
        {cutPct != null && cutoffLabel && (
          <span className="lk-pk-cutlabel" style={{ left: `${cutPct.toFixed(1)}%` }}>
            {cutoffLabel}
          </span>
        )}

        {/* labeled dose markers positioned over the chart */}
        {doses.map((d, i) => (
          <div
            key={i}
            className={cn('lk-pk-dose', d.warn && 'lk-pk-warn')}
            style={{ left: `${((PLOT_X0 + d.x * (PLOT_X1 - PLOT_X0)) / VB_W) * 100}%`, top: `${(1 - d.y) * 100}%` }}
          >
            <span className="lk-pk-dmg">{d.label}</span>
            <span className="lk-pk-dot" />
            <span className="lk-pk-dtime">{d.time}</span>
          </div>
        ))}
      </div>

      <div className="lk-pk-axis">
        {axis.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>

      <div className="lk-pk-legend">
        <span>
          <i style={{ background: 'linear-gradient(90deg, var(--zone-mid), var(--zone-low))' }} /> concentration
        </span>
        <span>
          <i style={{ background: 'var(--zone-mid)' }} /> dose
        </span>
        <span>
          <i style={{ background: 'var(--zone-low)' }} /> sleep cutoff
        </span>
      </div>

      <div className="lk-pk-readout">
        <span className="lk-pk-active">
          <span className="lk-pk-mg">{activeMg}</span>
          {readout}
        </span>
        {warnChip && (
          <Chip tone="mid" dot className="lk-mono">
            {warnChip}
          </Chip>
        )}
      </div>
    </div>
  );
}

export type { PkSample as CaffeineSample, PkDose as CaffeineDose };

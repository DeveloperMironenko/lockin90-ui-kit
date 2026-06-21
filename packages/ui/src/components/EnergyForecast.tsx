import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** A peak/dip annotation: an SVG dot at (x,y) plus an overlaid tag label. */
export interface ForecastMarker {
  /** dot x in viewBox units (0–560) */
  x: number;
  /** dot y in viewBox units (0–180) */
  y: number;
  /** tag eyebrow, e.g. "PEAK" / "DIP" */
  kind: string;
  /** big display value, e.g. "88" */
  value: string | number;
  /** trailing time, e.g. "10am" */
  at: string;
  /** label left position, e.g. "20%" */
  left: string;
  /** label top position, e.g. "8px" or "62%" */
  top: string;
}

/** A single legend swatch + label. */
export interface ForecastLegendItem {
  label: string;
  /** swatch color (token-backed var or hex) */
  color: string;
}

/** A driver chip behind the forecast. */
export interface ForecastDriver {
  label: string;
  tone: ChipTone;
}

export interface EnergyForecastProps extends HTMLAttributes<HTMLDivElement> {
  /** card title, e.g. "Today's outlook" */
  title?: string;
  /** mono uppercase eyebrow under the title */
  subtitle?: string;
  /** trailing tone chip label, e.g. "FORECAST" */
  chipLabel?: string;
  /** tone of the trailing chip */
  chipTone?: ChipTone;
  /**
   * Forecast curve as an SVG path string in the 560×180 viewBox. The matching
   * gradient area is derived by closing this path down to the floor.
   */
  linePath?: string;
  /** x of the vertical "now" marker line, in viewBox units (0–560) */
  nowX?: number;
  /** y of the dot on the "now" marker line, in viewBox units */
  nowY?: number;
  /** "now" pill text, e.g. "NOW 9:42am" */
  nowLabel?: string;
  /** "now" pill left position, e.g. "10%" */
  nowLeft?: string;
  /** "now" pill top offset, e.g. "-2px" */
  nowTop?: string;
  /** peak annotation (high zone) */
  peak?: ForecastMarker;
  /** dip annotation (low zone) */
  dip?: ForecastMarker;
  /** x-axis hour ticks */
  axis?: string[];
  /** legend swatches */
  legend?: ForecastLegendItem[];
  /** plain-language outlook line (rich text allowed) */
  outlook?: ReactNode;
  /** drivers chip row */
  drivers?: ForecastDriver[];
  /** mono uppercase label before the driver chips */
  driversLabel?: string;
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

const VB_W = 560;
const VB_H = 180;

/** Faithful reproduction of the design's "Today's outlook" example. */
const DEFAULT_LINE =
  'M0,52 L40,40 L80,30 L112,28 L152,38 L192,56 L232,80 L268,104 L300,116 L320,118 L352,108 L392,90 L432,76 L472,66 L512,60 L560,58';
const DEFAULT_AXIS = ['9am', '11am', '1pm', '3pm', '5pm', '7pm', '9pm'];
const DEFAULT_PEAK: ForecastMarker = { x: 112, y: 28, kind: 'PEAK', value: 88, at: '10am', left: '20%', top: '8px' };
const DEFAULT_DIP: ForecastMarker = { x: 320, y: 118, kind: 'DIP', value: 58, at: '3pm', left: '57%', top: '62%' };
const DEFAULT_LEGEND: ForecastLegendItem[] = [
  { label: 'HIGH', color: 'var(--zone-high)' },
  { label: 'MODERATE', color: 'var(--zone-mid)' },
  { label: 'LOW', color: 'var(--zone-low)' },
  { label: 'now', color: 'var(--accent)' },
];
const DEFAULT_DRIVERS: ForecastDriver[] = [
  { label: 'good sleep +', tone: 'high' },
  { label: 'late caffeine −', tone: 'low' },
];
const DEFAULT_OUTLOOK = (
  <>
    <b>Strong morning</b> — protect your <b>10am peak</b>; expect a <b>3pm dip</b> after lunch, recovering through the evening.
  </>
);
const DEFAULT_ARIA =
  'Energy forecast next 12h: morning peak ~88 at 10am, 3pm dip ~58, evening recovery. Now 9:42am.';

/** Horizontal gridlines inside the chart (in viewBox y units). */
const GRID = [45, 90, 135];

/** Energy forecast — a 12h prediction card with a forecast curve (gradient area
 *  + glowing line), a "now" marker line, peak/dip annotation dots with overlaid
 *  tag labels, an hour x-axis, a HIGH/MODERATE/LOW + now legend, a plain-language
 *  outlook line and a drivers chip row. */
export function EnergyForecast({
  title = "Today's outlook",
  subtitle = 'Next 12 hours',
  chipLabel = 'FORECAST',
  chipTone = 'accent',
  linePath = DEFAULT_LINE,
  nowX = 56,
  nowY = 35,
  nowLabel = 'NOW 9:42am',
  nowLeft = '10%',
  nowTop = '-2px',
  peak = DEFAULT_PEAK,
  dip = DEFAULT_DIP,
  axis = DEFAULT_AXIS,
  legend = DEFAULT_LEGEND,
  outlook = DEFAULT_OUTLOOK,
  drivers = DEFAULT_DRIVERS,
  driversLabel = 'Drivers',
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: EnergyForecastProps) {
  const uid = useId();
  const strokeId = `lk-fc-stroke-${uid}`;
  const fillId = `lk-fc-fill-${uid}`;
  // close the line down to the floor for the gradient area fill
  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <div className={cn('lk-fc', 'lk-card', className)} {...rest}>
      <div className="lk-fc-head">
        <div>
          <div className="lk-fc-title">{title}</div>
          {subtitle && <div className="lk-fc-sub">{subtitle}</div>}
        </div>
        {chipLabel && (
          <Chip tone={chipTone} dot>
            {chipLabel}
          </Chip>
        )}
      </div>

      <div className="lk-fc-curve" role="img" aria-label={ariaLabel}>
        <svg className="lk-fc-spark" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0">
              <stop offset="0" stopColor="#A8FF35" />
              <stop offset=".30" stopColor="#34F5C5" />
              <stop offset=".52" stopColor="#FFB020" />
              <stop offset=".70" stopColor="#34F5C5" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H}>
              <stop offset="0" stopColor="rgba(124,92,255,.30)" />
              <stop offset="1" stopColor="rgba(124,92,255,0)" />
            </linearGradient>
          </defs>

          {/* horizontal gridlines */}
          <g stroke="rgba(255,255,255,.05)" strokeWidth="1">
            {GRID.map((gy) => (
              <line key={gy} x1="0" y1={gy} x2={VB_W} y2={gy} />
            ))}
          </g>

          {/* gradient area + glowing line */}
          <path d={areaPath} fill={`url(#${fillId})`} opacity=".9" />
          <path
            className="lk-fc-line"
            d={linePath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* "now" marker: vertical line + dot */}
          <line x1={nowX} y1="10" x2={nowX} y2="170" stroke="rgba(124,92,255,.5)" strokeWidth="1.5" strokeDasharray="3 4" />
          <circle cx={nowX} cy={nowY} r="4.5" fill="var(--accent)" stroke="#0C0F1A" strokeWidth="2" />

          {/* peak + dip dots */}
          {peak && <circle cx={peak.x} cy={peak.y} r="4" fill="var(--zone-high)" stroke="#0C0F1A" strokeWidth="2" />}
          {dip && <circle cx={dip.x} cy={dip.y} r="4" fill="var(--zone-low)" stroke="#0C0F1A" strokeWidth="2" />}
        </svg>

        {/* overlaid tag labels */}
        <span className="lk-fc-now-tag" style={{ left: nowLeft, top: nowTop }}>
          {nowLabel}
        </span>
        {peak && (
          <span className="lk-fc-dot-tag lk-peak" style={{ left: peak.left, top: peak.top }}>
            {peak.kind} <b>{peak.value}</b> · {peak.at}
          </span>
        )}
        {dip && (
          <span className="lk-fc-dot-tag lk-dip" style={{ left: dip.left, top: dip.top }}>
            {dip.kind} <b>{dip.value}</b> · {dip.at}
          </span>
        )}

        <div className="lk-fc-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>

        <div className="lk-fc-legend">
          {legend.map((l, i) => (
            <span key={i}>
              <i style={{ background: l.color }} /> {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="lk-fc-pred">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
        </svg>
        <p>{outlook}</p>
      </div>

      <div className="lk-fc-drivers">
        {driversLabel && <span className="lk-fc-dlabel">{driversLabel}</span>}
        {drivers.map((d, i) => (
          <Chip key={i} tone={d.tone} dot>
            {d.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

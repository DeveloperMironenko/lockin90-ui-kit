import { useId, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** A round HTML overlay dot pinned over a data point (kept circular despite the
 *  SVG's `preserveAspectRatio="none"`), with an optional floating label tag. */
export interface LineMarker {
  /** index into `data` to anchor the dot on */
  index: number;
  /** dot color (token-backed var or hex); defaults to the line `color` */
  color?: string;
  /** optional small floating tag above the dot */
  label?: string;
}

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  /** y-values, auto-scaled to fit the plot height */
  data?: number[];
  /** x labels under the chart (optional) */
  axis?: string[];
  /** line color (a token var or hex) */
  color?: string;
  /** optional multi-stop horizontal line gradient; overrides `color` for the stroke */
  gradient?: string[];
  /** faint area fill under the line in `color` */
  area?: boolean;
  /** Catmull-Rom smoothing; when false, straight segments */
  smooth?: boolean;
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** round HTML overlay dots at data indices, with optional label tags */
  markers?: LineMarker[];
  /** faint horizontal gridlines */
  grid?: boolean;
  /** show value labels down the right edge, on the data's y-scale */
  yAxis?: boolean;
  /** explicit y-axis tick values; if omitted (and `yAxis`), ~4 evenly-spaced
   *  ticks are derived from the data min..max */
  yTicks?: number[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the line never touches the top/bottom edge */
const PAD_Y = 14;
/** number of interior horizontal gridlines */
const GRID_LINES = 3;
/** number of derived y-axis ticks when `yTicks` is omitted.
 *  The gutter width is defined in lc.css (--lk-lc-gutter, 40px). */
const Y_TICKS = 4;

/** Map a value to its y position (viewBox units) using the same inverted,
 *  auto-scaled mapping as `toPoints` (max → top, min → bottom). */
function valueToY(v: number, min: number, span: number, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const t = (v - min) / span;
  return bottom - t * (bottom - top);
}

/** Derive ~`Y_TICKS` evenly-spaced tick values across [min, max]. */
function deriveTicks(min: number, max: number): number[] {
  if (max === min) return [min];
  const ticks: number[] = [];
  for (let i = 0; i < Y_TICKS; i++) {
    ticks.push(min + ((max - min) * i) / (Y_TICKS - 1));
  }
  return ticks;
}

/** Compact label for a tick value: integers as-is, else 1 decimal. */
const tickLabel = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

const DEFAULT_DATA = [52, 40, 30, 28, 38, 56, 80, 104, 116, 118, 108, 90, 76, 66, 60, 58];
const DEFAULT_AXIS = ['9am', '12pm', '3pm', '6pm', '9pm'];

/** Map data values to viewBox points. Auto-scales y into [PAD_Y, height−PAD_Y]
 *  (inverted, since SVG y grows downward) and spreads x evenly across VB_W. */
function toPoints(data: number[], height: number): Array<[number, number]> {
  const n = data.length;
  if (n === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // avoid /0 when flat
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  return data.map((v, i) => {
    const x = n === 1 ? VB_W / 2 : (i / (n - 1)) * VB_W;
    const t = (v - min) / span; // 0 at min, 1 at max
    const y = bottom - t * (bottom - top); // max → top, min → bottom
    return [x, y];
  });
}

/** Round a number for compact path strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** Straight polyline through the points. */
function linePath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(' ');
}

/** Catmull-Rom spline expressed as cubic béziers — a smooth curve passing
 *  through every point (endpoints duplicated so the ends stay anchored). */
function smoothPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    // Catmull-Rom → Bézier control points (tension = 1/6)
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/** LineChart — a generic line/area chart primitive: a smooth (Catmull-Rom) or
 *  straight gradient/solid line over a faint area fill and horizontal grid, with
 *  optional round HTML marker dots + label tags and an x-axis row. The SVG uses
 *  `preserveAspectRatio="none"` so it stretches to any width; markers are HTML
 *  overlays positioned by percentage so they stay perfectly round. */
export function LineChart({
  data = DEFAULT_DATA,
  axis = DEFAULT_AXIS,
  color = 'var(--mint)',
  gradient,
  area = true,
  smooth = true,
  height = 180,
  markers,
  grid = true,
  yAxis = false,
  yTicks,
  ariaLabel,
  className,
  ...rest
}: LineChartProps) {
  const uid = useId();
  const strokeId = `lk-lc-stroke-${uid}`;
  const fillId = `lk-lc-fill-${uid}`;

  const pts = toPoints(data, height);
  const line = smooth ? smoothPath(pts) : linePath(pts);
  // close the line down to the floor for the area fill
  const areaPath = line ? `${line} L${VB_W},${height} L0,${height} Z` : '';

  const useGradient = Array.isArray(gradient) && gradient.length >= 2;
  const stroke = useGradient ? `url(#${strokeId})` : color;

  // y-axis tick values + their y positions (same scale as the plotted line)
  const dMin = data.length ? Math.min(...data) : 0;
  const dMax = data.length ? Math.max(...data) : 0;
  const dSpan = dMax - dMin || 1;
  const ticks = yAxis ? (yTicks && yTicks.length > 0 ? yTicks : deriveTicks(dMin, dMax)) : [];
  const tickRows = ticks.map((v) => ({ v, y: valueToY(v, dMin, dSpan, height) }));

  // interior gridline y-positions — align with the ticks when the y-axis is on,
  // otherwise the evenly-spaced default interior lines.
  let gridYs: number[] = [];
  if (grid) {
    if (yAxis && tickRows.length > 0) {
      gridYs = tickRows.map((t) => t.y);
    } else {
      for (let i = 1; i <= GRID_LINES; i++) {
        gridYs.push((height / (GRID_LINES + 1)) * i);
      }
    }
  }

  return (
    <div className={cn('lk-lc', yAxis && 'lk-lc--yaxis', className)} {...rest}>
      <div className="lk-lc-plot" style={{ height }}>
        {/* drawing area: shrinks by the gutter width when the y-axis is on, so
            the line/markers stay in lock-step with the value labels */}
        <div className="lk-lc-canvas">
        <svg
          className="lk-lc-svg"
          viewBox={`0 0 ${VB_W} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            {useGradient && (
              <linearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0">
                {gradient!.map((stop, i) => (
                  <stop key={i} offset={gradient!.length === 1 ? 0 : i / (gradient!.length - 1)} stopColor={stop} />
                ))}
              </linearGradient>
            )}
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={height}>
              <stop offset="0" stopColor={color} stopOpacity="0.26" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* faint horizontal gridlines */}
          {gridYs.length > 0 && (
            <g className="lk-lc-grid">
              {gridYs.map((gy) => (
                <line key={gy} x1="0" y1={r(gy)} x2={VB_W} y2={r(gy)} />
              ))}
            </g>
          )}

          {/* area fill under the line */}
          {area && areaPath && <path d={areaPath} fill={`url(#${fillId})`} />}

          {/* the line itself (glowing) */}
          {line && (
            <path
              className="lk-lc-line"
              d={line}
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* round HTML marker overlays — positioned by % so they stay circular */}
        {markers?.map((m, i) => {
          const pt = pts[m.index];
          if (!pt) return null;
          const left = `${(pt[0] / VB_W) * 100}%`;
          const top = `${(pt[1] / height) * 100}%`;
          const dot = m.color ?? color;
          return (
            <div key={i} className="lk-lc-marker" style={{ left, top }}>
              {m.label && (
                <span className="lk-lc-tag" style={{ color: dot, borderColor: dot }}>
                  {m.label}
                </span>
              )}
              <span className="lk-lc-dot" style={{ background: dot }} />
            </div>
          );
        })}
        </div>

        {/* y-axis value labels, pinned in the right gutter at each tick's y */}
        {yAxis && tickRows.length > 0 && (
          <div className="lk-lc-yaxis" aria-hidden="true">
            {tickRows.map((t, i) => (
              <span key={i} className="lk-lc-ytick" style={{ top: `${(t.y / height) * 100}%` }}>
                {tickLabel(t.v)}
              </span>
            ))}
          </div>
        )}
      </div>

      {axis && axis.length > 0 && (
        <div className="lk-lc-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

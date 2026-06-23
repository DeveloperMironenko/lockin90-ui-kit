import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** A colored phase band on the 24h ring, drawn CLOCKWISE from `from` to `to`
 *  (hours 0..24). When `from > to` the band wraps through midnight (e.g. 23→7). */
export interface PhaseArc {
  /** band start hour, 0..24 */
  from: number;
  /** band end hour, 0..24 (clockwise from `from`; wraps midnight when < `from`) */
  to: number;
  /** the band color — a token var() or hex */
  color: string;
  /** optional label (for accessibility / external legends) */
  label?: string;
}

/** A point marker sitting ON the ring at a given hour. */
export interface PhaseMarker {
  /** the hour, 0..24 */
  at: number;
  /** the dot color — a token var() or hex (default var(--accent)) */
  color?: string;
  /** optional tiny label, placed just outside the ring */
  label?: string;
}

export interface PhaseWheelProps extends HTMLAttributes<HTMLDivElement> {
  /** colored phase bands on the ring */
  arcs?: PhaseArc[];
  /** point markers on the ring */
  markers?: PhaseMarker[];
  /** the "now" hour, 0..24 → draws a hand from center to the ring + a tip dot.
   *  Pass `null` to hide the hand (omitting it keeps the default). */
  now?: number | null;
  /** overall diameter in px (default 200) */
  size?: number;
  /** ring stroke width in px (default 16) */
  thickness?: number;
  /** hour tick marks around the ring, longer + brighter at 0/6/12/18 (default true) */
  hourTicks?: boolean;
  /** center content — defaults to the formatted `now` clock, or '24h' when no `now` */
  children?: ReactNode;
}

/** Default circadian phases. */
const DEFAULT_ARCS: PhaseArc[] = [
  { from: 23, to: 7, color: '#6E7BFF', label: 'Sleep' }, // indigo, wraps midnight
  { from: 9, to: 12, color: '#34F5C5', label: 'Peak focus' }, // mint
  { from: 14, to: 16, color: '#FFB020', label: 'Afternoon dip' }, // warn
  { from: 21, to: 23, color: '#A855F7', label: 'Wind-down' }, // violet
];

const DEFAULT_MARKERS: PhaseMarker[] = [
  { at: 7, color: '#22D3EE', label: 'Wake' },
  { at: 21, color: '#A855F7', label: 'Melatonin' },
];

/** clockwise span of an arc in hours, wrap-aware (from > to wraps midnight). */
function arcSpanHours(from: number, to: number) {
  return ((to - from + 24) % 24) || 24;
}

/** point on a circle at center `c` radius `r` for hour `h` (0..24), with hour 0
 *  at the top (12 o'clock) and growing clockwise. */
function hourPoint(c: number, r: number, h: number) {
  const deg = (h / 24) * 360 - 90;
  const a = (deg * Math.PI) / 180;
  return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
}

/** Format an hour (0..24, may be fractional) as a 12h clock like '2:30p'
 *  (a/p suffix, drops ':00'). */
function formatHour(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const totalMin = Math.round(norm * 60) % (24 * 60);
  let hr = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  const suffix = hr >= 12 ? 'p' : 'a';
  let h12 = hr % 12;
  if (h12 === 0) h12 = 12;
  return min === 0 ? `${h12}${suffix}` : `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

/** The four cardinal hour labels at 0/6/12/18. */
const CARDINALS: { h: number; label: string }[] = [
  { h: 0, label: '12a' },
  { h: 6, label: '6a' },
  { h: 12, label: '12p' },
  { h: 18, label: '6p' },
];

/**
 * PhaseWheel — a circular 24-hour circadian clock: a faint full track ring with
 * colored phase bands (sleep / focus / dip / wind-down), hour ticks (longer +
 * brighter at the quarters with cardinal labels), point markers on the ring, an
 * optional "now" hand from center to the ring, and centered content (the
 * formatted current time or '24h'). Hour 0 (midnight) sits at the top and time
 * runs clockwise. Tokens-driven, no Tailwind.
 */
export function PhaseWheel({
  arcs = DEFAULT_ARCS,
  markers = DEFAULT_MARKERS,
  now = 14.5,
  size = 200,
  thickness = 16,
  hourTicks = true,
  children,
  className,
  ...rest
}: PhaseWheelProps) {
  const uid = useId();
  void uid; // reserved for future gradient ids; keeps parity with sibling primitives

  const c = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  // tick geometry (just outside the ring)
  const tickBase = r + thickness / 2 + 2;
  const tickMinor = tickBase + 3;
  const tickMajor = tickBase + 6;
  const labelRadius = tickMajor + 9;
  // marker label radius (outside the ring)
  const markerLabelRadius = r + thickness / 2 + 12;

  // `now` is hidden when null/undefined; precompute the hand tip + clock label
  // (narrowed here so the render guards stay simple)
  const nowTip = now != null ? hourPoint(c, r, now) : null;
  const nowLabel = now != null ? formatHour(now) : null;

  const ariaLabel = `24-hour phase wheel${
    nowLabel ? `, now ${nowLabel}` : ''
  }: ${arcs.map((a) => a.label ?? 'phase').join(', ')}.`;

  return (
    <div
      className={cn('lk-pw', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    >
      <svg
        className="lk-pw-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* rotated group so fraction-of-circle hours start at 12 o'clock, clockwise */}
        <g transform={`rotate(-90 ${c} ${c})`}>
          {/* faint full track ring */}
          <circle
            className="lk-pw-track"
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          {/* colored phase bands */}
          {arcs.map((a, i) => {
            const span = arcSpanHours(a.from, a.to);
            const len = (span / 24) * circ;
            if (len <= 0) return null;
            const offset = -(a.from / 24) * circ;
            return (
              <circle
                key={`${a.label ?? 'arc'}-${i}`}
                className="lk-pw-arc"
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${len.toFixed(2)} ${(circ - len).toFixed(2)}`}
                strokeDashoffset={offset.toFixed(2)}
              />
            );
          })}
        </g>

        {/* hour ticks (drawn in screen space via hourPoint, no rotated group) */}
        {hourTicks
          ? Array.from({ length: 24 }, (_, h) => {
              const major = h % 6 === 0;
              const outer = major ? tickMajor : tickMinor;
              const p1 = hourPoint(c, tickBase, h);
              const p2 = hourPoint(c, outer, h);
              return (
                <line
                  key={`tick-${h}`}
                  className={major ? 'lk-pw-tick lk-pw-tick-major' : 'lk-pw-tick'}
                  x1={p1.x.toFixed(2)}
                  y1={p1.y.toFixed(2)}
                  x2={p2.x.toFixed(2)}
                  y2={p2.y.toFixed(2)}
                />
              );
            })
          : null}

        {/* cardinal labels at 0/6/12/18 */}
        {hourTicks
          ? CARDINALS.map(({ h, label }) => {
              const p = hourPoint(c, labelRadius, h);
              return (
                <text
                  key={`card-${h}`}
                  className="lk-pw-card"
                  x={p.x.toFixed(2)}
                  y={p.y.toFixed(2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              );
            })
          : null}

        {/* now hand — line from center to the inner edge of the ring + tip dot */}
        {nowTip ? (
          <g className="lk-pw-now">
            <line
              className="lk-pw-hand"
              x1={c}
              y1={c}
              x2={nowTip.x.toFixed(2)}
              y2={nowTip.y.toFixed(2)}
            />
            <circle className="lk-pw-hand-dot" cx={nowTip.x.toFixed(2)} cy={nowTip.y.toFixed(2)} r={4} />
          </g>
        ) : null}

        {/* markers — dots on the ring + optional labels just outside */}
        {markers.map((m, i) => {
          const p = hourPoint(c, r, m.at);
          const color = m.color ?? 'var(--accent)';
          const lp = m.label ? hourPoint(c, markerLabelRadius, m.at) : null;
          return (
            <g key={`mk-${m.label ?? 'm'}-${i}`}>
              <circle className="lk-pw-marker" cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={4} fill={color} />
              {lp ? (
                <text
                  className="lk-pw-marker-label"
                  x={lp.x.toFixed(2)}
                  y={lp.y.toFixed(2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {m.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="lk-pw-center">
        {children ?? (
          <span className="lk-pw-clock lk-display lk-tnum">
            {nowLabel ?? '24h'}
          </span>
        )}
      </div>
    </div>
  );
}

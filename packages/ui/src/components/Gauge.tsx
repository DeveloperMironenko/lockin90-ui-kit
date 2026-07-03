import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Zone verdict color for a normalized 0..1 value (catalog thresholds). */
function zoneColor01(t: number): string {
  return t >= 0.62 ? 'var(--zone-high)' : t >= 0.38 ? 'var(--zone-mid)' : 'var(--zone-low)';
}

/** A colored band on the [min,max] scale, filled up to its `to` value. Bands
 *  are stacked low→high; each paints from the previous band's `to` up to its
 *  own. */
export interface GaugeZone {
  /** upper bound of this band on the [min,max] scale */
  to: number;
  /** the band color — a token var() or hex */
  color: string;
}

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  /** the current value, clamped to [min,max] */
  value: number;
  /** scale floor (default 0) */
  min?: number;
  /** scale ceiling (default 100) */
  max?: number;
  /** overall square box size in px (default 140) */
  size?: number;
  /** arc stroke width in px (default 12) */
  thickness?: number;
  /** total sweep in degrees, opening at bottom-center (default 270) */
  sweep?: number;
  /** colored zone bands up to each `to` on the [min,max] scale. When omitted a
   *  single accent→mint progress arc to `value` is drawn over the track. */
  zones?: GaugeZone[];
  /** value-arc color — any CSS color / token (default `var(--accent)`).
   *  Ignored when a `gradient` array is given or `zone` is on. */
  color?: string;
  /** value-arc gradient along the sweep (left → right). An array (≥2) paints N
   *  evenly-spaced linearGradient stops — e.g. `['var(--zone-low)',
   *  'var(--zone-mid)', 'var(--zone-high)']` is the DN-13 red→amber→green
   *  strain gauge; a single string is treated like a solid `color`. */
  gradient?: string | string[];
  /** color the value arc + readout by the value's zone verdict on the
   *  [min,max] scale (≥62% → high, ≥38% → mid, else low). */
  zone?: boolean;
  /** glow underlay — a wider, blurred faint duplicate of the value arc
   *  (the catalog's shine modifier; off by default) */
  shine?: boolean;
  /** number of tick marks along the arc (default 0 = off) */
  ticks?: number;
  /** tick placement: `span` straddles the arc (default, legacy) · `out` sits
   *  just outside it (DN-13 gauge-270 look) */
  tickPosition?: 'span' | 'out';
  /** draw the end-cap dot at the current value (default true) */
  cap?: boolean;
  /** small caption under the value */
  label?: string;
  /** show the numeric value readout (default true) */
  showValue?: boolean;
  /** override the centered content (replaces value + label) */
  children?: ReactNode;
}

/** point on a circle at `cx,cy` radius `r` for screen-angle `deg`
 *  (0° = 3 o'clock, growing clockwise). */
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** SVG arc path from `startDeg` to `endDeg` (clockwise) on a circle. */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Gauge — an arc/dial primitive: a partial-circle track (default 270° sweep,
 * open at the bottom-center) showing a `value` on a [min,max] scale. Supports
 * colored `zones` bands (low/mid/high), a progress arc + round end cap to the
 * current value, optional `ticks`, and a centered value/label readout. Distinct
 * from `Ring` (a full-circle 0–100 single-color progress); Gauge adds an
 * arbitrary sweep, a min/max scale, multi-zone bands and ticks.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  size = 140,
  thickness = 12,
  sweep = 270,
  zones,
  color,
  gradient,
  zone = false,
  shine = false,
  ticks = 0,
  tickPosition = 'span',
  cap = true,
  label,
  showValue = true,
  children,
  className,
  style,
  ...rest
}: GaugeProps) {
  const uid = useId();
  const gradId = `lk-gauge-grad-${uid}`;

  const span = max - min || 1;
  const sw = Math.max(0, Math.min(360, sweep));
  const v = Math.max(min, Math.min(max, value));

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;

  // value-arc paint: zone verdict > N-stop gradient > single color (CSS default
  // var(--accent) applies when nothing is passed — stroke stays unset)
  const t01 = (v - min) / span;
  const useGradient = Array.isArray(gradient) && !zone;
  const solid = zone ? zoneColor01(t01) : typeof gradient === 'string' ? gradient : color;
  const arcStroke = useGradient ? `url(#${gradId})` : solid;
  const glowColor = zone
    ? solid
    : useGradient
      ? gradient[Math.floor(gradient.length / 2)]
      : (solid ?? 'var(--accent)');
  // cap tint follows the arc (gradient → its last stop, where the arc ends)
  const capColor = useGradient ? gradient[gradient.length - 1] : (solid ?? 'var(--accent)');

  // The gap is centered at the bottom (screen-angle 90°). The arc starts to the
  // left of bottom and sweeps clockwise over the top to the right of bottom.
  const startDeg = 90 + (360 - sw) / 2;
  const endDeg = startDeg + sw;
  /** map a [min,max] value to its screen-angle along the sweep */
  const toAngle = (val: number) => startDeg + ((val - min) / span) * sw;

  const hasZones = Array.isArray(zones) && zones.length > 0;

  // zone band arcs, stacked low→high from `min`
  const bands = hasZones
    ? zones!
        .slice()
        .sort((a, b) => a.to - b.to)
        .reduce<{ from: number; to: number; color: string }[]>((acc, z) => {
          const prev = acc.length ? acc[acc.length - 1]!.to : min;
          const to = Math.max(min, Math.min(max, z.to));
          if (to > prev) acc.push({ from: prev, to, color: z.color });
          return acc;
        }, [])
    : [];

  // tick angles evenly spaced across the sweep (inclusive of both ends)
  const tickMarks: number[] = [];
  if (ticks > 0) {
    const n = ticks;
    for (let i = 0; i < n; i++) {
      tickMarks.push(startDeg + (n === 1 ? 0 : (i / (n - 1)) * sw));
    }
  }
  // `span` straddles the arc (legacy); `out` sits just past its outer edge (DN-13)
  const tickOuter = r + thickness / 2 + (tickPosition === 'out' ? 7.5 : 2);
  const tickInner = tickPosition === 'out' ? r + thickness / 2 + 2.5 : r - thickness / 2 - 2;

  const valueAngle = toAngle(v);

  return (
    <div
      className={cn('lk-gauge', className)}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={`Gauge: ${Math.round(v)} of ${max}.`}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {useGradient ? (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              {gradient.map((stopColor, i) => (
                <stop
                  key={i}
                  offset={i / Math.max(1, gradient.length - 1)}
                  stopColor={stopColor}
                />
              ))}
            </linearGradient>
          </defs>
        ) : null}

        {/* track — the full sweep, faint */}
        <path
          className="lk-gauge-track"
          d={arcPath(cx, cy, r, startDeg, endDeg)}
          strokeWidth={thickness}
        />

        {/* zone bands (when provided) */}
        {bands.map((b, i) => (
          <path
            key={`band-${i}`}
            className="lk-gauge-zone"
            d={arcPath(cx, cy, r, toAngle(b.from), toAngle(b.to))}
            stroke={b.color}
            strokeWidth={thickness}
          />
        ))}

        {/* shine — a wider, blurred faint duplicate under the value arc */}
        {shine && !hasZones && v > min ? (
          <path
            d={arcPath(cx, cy, r, startDeg, valueAngle)}
            fill="none"
            stroke={arcStroke ?? 'var(--accent)'}
            strokeWidth={thickness + 5}
            strokeLinecap="round"
            opacity={0.5}
            style={{ filter: 'blur(6px)' }}
          />
        ) : null}

        {/* progress arc to value — only when there are no zones (zones already
            color the scale up to the value's band) */}
        {!hasZones && v > min ? (
          <path
            className="lk-gauge-arc"
            d={arcPath(cx, cy, r, startDeg, valueAngle)}
            strokeWidth={thickness}
            style={
              {
                ...(arcStroke ? { stroke: arcStroke } : {}),
                ['--lk-gauge-glow']: glowColor,
              } as CSSProperties
            }
          />
        ) : null}

        {/* ticks */}
        {tickMarks.map((deg, i) => {
          const a = polar(cx, cy, tickOuter, deg);
          const b = polar(cx, cy, tickInner, deg);
          return (
            <line
              key={`tick-${i}`}
              className="lk-gauge-tick"
              x1={a.x.toFixed(2)}
              y1={a.y.toFixed(2)}
              x2={b.x.toFixed(2)}
              y2={b.y.toFixed(2)}
            />
          );
        })}

        {/* end cap — a dot marking the current value on the arc */}
        {cap && v > min ? (
          (() => {
            const p = polar(cx, cy, r, valueAngle);
            return (
              <circle
                className="lk-gauge-cap"
                cx={p.x.toFixed(2)}
                cy={p.y.toFixed(2)}
                r={thickness / 2 + 1}
                style={
                  {
                    stroke: capColor,
                    filter: `drop-shadow(0 0 6px ${capColor})`,
                  } as CSSProperties
                }
              />
            );
          })()
        ) : null}
      </svg>

      <div className="lk-gauge-center">
        {children ?? (
          <>
            {showValue ? (
              <span
                className="lk-gauge-value lk-tnum"
                style={zone ? { color: solid } : undefined}
              >
                {Math.round(v)}
              </span>
            ) : null}
            {label ? <span className="lk-gauge-label">{label}</span> : null}
          </>
        )}
      </div>
    </div>
  );
}

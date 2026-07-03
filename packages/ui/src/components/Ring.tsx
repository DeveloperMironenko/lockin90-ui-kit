import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Zone verdict color for a 0–100 value (same thresholds as the chart catalog). */
function zoneColor(v: number): string {
  return v >= 62 ? 'var(--zone-high)' : v >= 38 ? 'var(--zone-mid)' : 'var(--zone-low)';
}

export interface RingProps extends HTMLAttributes<HTMLDivElement> {
  /** Arc fill, 0–100 (clamped). */
  value?: number;
  /** Second ring's fill, 0–100 — `dual` (inner ring) and `triple` (middle ring). */
  value2?: number;
  /** Third ring's fill, 0–100 — `triple` (innermost ring). */
  value3?: number;
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Stroke width of both the track and the arc, in px.
   *  Defaults to `7` (or `4` for `variant="thin-halo"` — DN-06). */
  thickness?: number;
  /** Arc color — any CSS color / token, e.g. 'var(--mint)'. Ignored when a
   *  `gradient` array is given or `zone` is on. */
  color?: string;
  /** Second ring's color — defaults to `var(--violet)` (`dual`, DN-04) or
   *  `var(--cyan)` (`triple`, DN-05). */
  color2?: string;
  /** Third ring's color — defaults to `var(--violet)` (`triple`, DN-05). */
  color3?: string;
  /** Track (unfilled) color. */
  trackColor?: string;
  /** Optional arc gradient. A `[from, to]` tuple paints a two-stop
   *  linearGradient; an N-length array (≥2, e.g. `gradients.flux.stops`) paints
   *  N evenly-spaced stops — the full flux spectrum arc; a single string is
   *  treated like a solid `color`. Applies to the main (outer) arc only. */
  gradient?: string | string[];
  /** Soft drop-shadow glow in the arc color (on by default). */
  glow?: boolean;
  /** Color the arc + default center number by the value's zone verdict
   *  (≥62 → `--zone-high`, ≥38 → `--zone-mid`, else `--zone-low`) — DN-03. */
  zone?: boolean;
  /** Catalog variant (donut-charts DN-01…DN-09):
   *  - `score` (default) — single ring + center stat (DN-01)
   *  - `dual` — concentric outer + inner ring, shared center stat (DN-04)
   *  - `triple` — activity-style 3 concentric rings, no default center (DN-05)
   *  - `thin-halo` — quiet 4px ring (DN-06)
   *  - `dashed-track` — dotted `2 5` track under a solid arc (DN-07)
   *  - `pulse` — pulsing dot rides the arc end, reduced-motion safe (DN-08)
   *  - `delta` — score ring + delta chip under the center (DN-09; the chip
   *    renders whenever `delta` is set, on any variant) */
  variant?: 'score' | 'dual' | 'triple' | 'thin-halo' | 'dashed-track' | 'pulse' | 'delta';
  /** Delta chip text under the center stat (e.g. '+6 VS YESTERDAY') — DN-09. */
  delta?: string;
  /** Delta chip tint. */
  deltaColor?: string;
  /** Centered content. When omitted the rounded `value` is shown as the number
   *  (`triple` shows nothing by default — three values are ambiguous). */
  children?: ReactNode;
}

/**
 * Ring — a generic, prop-driven circular-progress primitive: an SVG track +
 * colored progress arc (rotated −90° so it starts at 12 o'clock, round
 * linecap, soft color glow) with absolutely-centered readout content. Solid by
 * default; pass a `[from, to]` `gradient` for a two-stop arc, or an N-stop
 * array (e.g. `gradients.flux.stops`) for the full spectrum. Covers the
 * catalog score-ring family (DN-01…DN-09) via `variant` + `zone`/`delta`.
 */
export function Ring({
  value = 72,
  value2,
  value3,
  size = 108,
  thickness,
  color = 'var(--mint)',
  color2,
  color3,
  trackColor = 'var(--border)',
  gradient,
  glow = true,
  zone = false,
  variant = 'score',
  delta,
  deltaColor = 'var(--mint)',
  children,
  className,
  style,
  ...rest
}: RingProps) {
  const uid = useId();
  const gradId = `lk-ring-grad-${uid}`;

  const sw = thickness ?? (variant === 'thin-halo' ? 4 : 7);
  const v = Math.max(0, Math.min(100, value));
  // radius leaves a half-stroke of breathing room so the arc never clips
  const r = (size - sw) / 2;

  const useGradient = Array.isArray(gradient) && !zone;
  // resolved solid arc color: zone verdict > explicit single-string gradient > color
  const solid = zone ? zoneColor(v) : typeof gradient === 'string' ? gradient : color;
  const stroke = useGradient ? `url(#${gradId})` : solid;
  // glow / pulse tint to the arc color (gradient → mint, like the catalog)
  const glowColor = useGradient ? 'var(--mint)' : solid;

  const half = size / 2;
  const dashedTrack = variant === 'dashed-track';

  // concentric ring set: [radius, value, stroke, glowColor][] outer → inner.
  // Inner radii step by thickness + 4 (catalog r52/r38 · r52/r39/r26 spacing).
  const step = sw + 4;
  const rings: { r: number; v: number; stroke: string; glowC: string }[] = [
    { r, v, stroke, glowC: glowColor },
  ];
  if (variant === 'dual' || variant === 'triple') {
    const c2 = color2 ?? (variant === 'triple' ? 'var(--cyan)' : 'var(--violet)');
    rings.push({
      r: r - step,
      v: Math.max(0, Math.min(100, value2 ?? 0)),
      stroke: c2,
      glowC: c2,
    });
  }
  if (variant === 'triple') {
    const c3 = color3 ?? 'var(--violet)';
    rings.push({
      r: r - 2 * step,
      v: Math.max(0, Math.min(100, value3 ?? 0)),
      stroke: c3,
      glowC: c3,
    });
  }

  // pulse dot at the main arc's end (svg is rotated −90°, so 0° = the arc start)
  const pulseAngle = (v / 100) * 360 * (Math.PI / 180);
  const px = half + r * Math.cos(pulseAngle);
  const py = half + r * Math.sin(pulseAngle);

  const centerNumColor = zone ? solid : undefined;

  return (
    <div
      className={cn('lk-ring', className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {useGradient ? (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
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
        {rings.map((ring, i) => {
          const c = 2 * Math.PI * ring.r;
          const dashOffset = c * (1 - ring.v / 100);
          return (
            <g key={i}>
              <circle
                className="lk-ring-track"
                cx={half}
                cy={half}
                r={ring.r}
                stroke={trackColor}
                strokeWidth={sw}
                strokeDasharray={dashedTrack ? '2 5' : undefined}
              />
              <circle
                className="lk-ring-arc"
                cx={half}
                cy={half}
                r={ring.r}
                stroke={ring.stroke}
                strokeWidth={sw}
                strokeDasharray={c.toFixed(2)}
                strokeDashoffset={dashOffset.toFixed(2)}
                style={
                  { ['--lk-ring-glow']: glow ? ring.glowC : 'transparent' } as CSSProperties
                }
              />
            </g>
          );
        })}
        {variant === 'pulse' ? (
          <g style={{ ['--lk-ring-pulse']: glowColor } as CSSProperties}>
            <circle
              className="lk-ring-pulse-dot"
              cx={px.toFixed(2)}
              cy={py.toFixed(2)}
              r={3.6}
              fill={glowColor}
            />
            <circle
              className="lk-ring-pulse-wave"
              cx={px.toFixed(2)}
              cy={py.toFixed(2)}
              r={3.6}
              fill="none"
              stroke={glowColor}
              strokeWidth={1.4}
            />
          </g>
        ) : null}
      </svg>
      <div className="lk-ring-center">
        {children ??
          (variant === 'triple' ? null : (
            <span className="lk-ring-num lk-tnum" style={{ color: centerNumColor }}>
              {Math.round(v)}
            </span>
          ))}
        {delta ? (
          <span
            className="lk-ring-delta lk-mono"
            style={{ ['--lk-ring-delta-c']: deltaColor } as CSSProperties}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface RingProps extends HTMLAttributes<HTMLDivElement> {
  /** Arc fill, 0–100 (clamped). */
  value?: number;
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Stroke width of both the track and the arc, in px. */
  thickness?: number;
  /** Arc color — any CSS color / token, e.g. 'var(--mint)'. Ignored when a
   *  `gradient` array is given. */
  color?: string;
  /** Track (unfilled) color. */
  trackColor?: string;
  /** Optional arc gradient. A `[from, to]` tuple paints a two-stop
   *  linearGradient; an N-length array (≥2, e.g. `gradients.flux.stops`) paints
   *  N evenly-spaced stops — the full flux spectrum arc; a single string is
   *  treated like a solid `color`. */
  gradient?: string | string[];
  /** Soft drop-shadow glow in the arc color (on by default). */
  glow?: boolean;
  /** Centered content. When omitted the rounded `value` is shown as the number. */
  children?: ReactNode;
}

/**
 * Ring — a generic, prop-driven circular-progress primitive: an SVG track +
 * colored progress arc (rotated −90° so it starts at 12 o'clock, round
 * linecap, soft color glow) with absolutely-centered readout content. Solid by
 * default; pass a `[from, to]` `gradient` for a two-stop arc, or an N-stop
 * array (e.g. `gradients.flux.stops`) for the full spectrum. Matches the
 * Aurora Flux ring look (energy/goal/substance gauges).
 */
export function Ring({
  value = 72,
  size = 108,
  thickness = 7,
  color = 'var(--mint)',
  trackColor = 'var(--border)',
  gradient,
  glow = true,
  children,
  className,
  style,
  ...rest
}: RingProps) {
  const uid = useId();
  const gradId = `lk-ring-grad-${uid}`;

  const v = Math.max(0, Math.min(100, value));
  // radius leaves a half-stroke of breathing room so the arc never clips
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - v / 100);

  const useGradient = Array.isArray(gradient);
  // resolved solid arc color: explicit single-string gradient > color
  const solid = typeof gradient === 'string' ? gradient : color;
  const stroke = useGradient ? `url(#${gradId})` : solid;
  // glow tints to the arc color (gradient → its first stop)
  const glowColor = useGradient ? gradient[0] : solid;

  const half = size / 2;

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
        <circle
          className="lk-ring-track"
          cx={half}
          cy={half}
          r={r}
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          className="lk-ring-arc"
          cx={half}
          cy={half}
          r={r}
          stroke={stroke}
          strokeWidth={thickness}
          strokeDasharray={c.toFixed(2)}
          strokeDashoffset={dashOffset.toFixed(2)}
          style={{ ['--lk-ring-glow']: glow ? glowColor : 'transparent' } as CSSProperties}
        />
      </svg>
      <div className="lk-ring-center">
        {children ?? <span className="lk-ring-num lk-tnum">{Math.round(v)}</span>}
      </div>
    </div>
  );
}

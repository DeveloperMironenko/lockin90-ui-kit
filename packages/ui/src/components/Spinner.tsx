import { useId, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Arc color — any CSS color / token. Used as the gradient's leading stop and
   *  the glow tint; the trailing stop is always the cyan accent for the Aurora
   *  energy-sweep look. */
  color?: string;
  /** Stroke width of both the track and the sweeping arc, in px. */
  thickness?: number;
  /** Accessible label, announced to screen readers (visually hidden). */
  label?: string;
}

/**
 * Spinner — an indeterminate circular loading spinner in the Aurora Flux
 * "energy-ring" style: a faint track with a sweeping gradient arc (a partial
 * `strokeDasharray` arc, round linecap, soft color glow) that rotates
 * continuously. Mirrors the `.spin` ring spinner from the loaders showcase.
 * Respects `prefers-reduced-motion` (the sweep slows way down rather than
 * stopping, so it still reads as "busy").
 */
export function Spinner({
  size = 24,
  color = 'var(--accent)',
  thickness = 3,
  label = 'Loading',
  className,
  style,
  ...rest
}: SpinnerProps) {
  const uid = useId();
  const gradId = `lk-spinner-grad-${uid}`;

  // radius leaves a half-stroke of breathing room so the arc never clips
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  // sweep ≈ 62% of the circumference (the rest is the gap) — matches the
  // showcase's ~0.6 dashoffset ratio for a confident partial arc.
  const dashOffset = c * 0.6;
  const half = size / 2;

  return (
    <div
      className={cn('lk-spinner', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ width: size, height: size, ['--lk-spinner-glow']: color, ...style } as CSSProperties}
      {...rest}
    >
      <svg className="lk-spinner-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle
          className="lk-spinner-track"
          cx={half}
          cy={half}
          r={r}
          strokeWidth={thickness}
        />
        <circle
          className="lk-spinner-arc"
          cx={half}
          cy={half}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={thickness}
          strokeDasharray={c.toFixed(2)}
          strokeDashoffset={dashOffset.toFixed(2)}
        />
      </svg>
      <span className="lk-sr-only">{label}</span>
    </div>
  );
}

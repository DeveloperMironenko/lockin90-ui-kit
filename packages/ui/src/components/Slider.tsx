import { type ChangeEvent, type CSSProperties, type InputHTMLAttributes } from 'react';
import { cn } from '../cn';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** current value (default 72) */
  value?: number;
  /** scale minimum (default 0) */
  min?: number;
  /** scale maximum (default 100) */
  max?: number;
  /** fired with the new numeric value on input */
  onChange?: (value: number) => void;
  /** the filled-portion paint — a CSS color OR a gradient string */
  fill?: string;
  /** thumb / fill glow color */
  glow?: string;
  /** the unfilled remainder rail color */
  trackColor?: string;
  /** optional scale labels rendered evenly-spaced under the rail (e.g. a
   *  mood/focus/energy scale). When omitted, nothing extra renders. */
  labels?: string[];
}

/** Generic Aurora-Flux range slider: a gray remainder rail, a gradient fill up
 *  to the value with a soft glow, and a glowing white thumb with a colored ring.
 *  A real, accessible `<input type="range">` is overlaid (visually hidden) so
 *  keyboard + drag work; the visual layers are driven by `value`. */
export function Slider({
  value = 72,
  min = 0,
  max = 100,
  onChange,
  fill = 'linear-gradient(90deg, var(--accent), var(--cyan))',
  glow = 'var(--accent)',
  trackColor = 'rgba(255,255,255,0.10)',
  labels,
  className,
  style,
  ...rest
}: SliderProps) {
  const span = max - min || 1;
  const pct = Math.max(0, Math.min(100, ((value - min) / span) * 100));

  const rootStyle = {
    '--pct': `${pct}%`,
    '--fill': fill,
    '--glow': glow,
    '--track': trackColor,
    ...style,
  } as CSSProperties;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
  };

  const rail = (
    <div className="lk-slider" style={rootStyle}>
      <span className="lk-slider-track" aria-hidden="true" />
      <span className="lk-slider-fill" aria-hidden="true" />
      <span className="lk-slider-thumb" aria-hidden="true" />
      <input
        className="lk-slider-input"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </div>
  );

  // No labels → identical to before: the rail itself carries className + rest.
  if (!labels || labels.length === 0) {
    return (
      <div className={cn('lk-slider', className)} style={rootStyle} {...rest}>
        <span className="lk-slider-track" aria-hidden="true" />
        <span className="lk-slider-fill" aria-hidden="true" />
        <span className="lk-slider-thumb" aria-hidden="true" />
        <input
          className="lk-slider-input"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  }

  // With labels → wrap the rail + an evenly-spaced labels row.
  return (
    <div className={cn('lk-slider-field', className)} {...rest}>
      {rail}
      <div className="lk-slider-labels" aria-hidden="true">
        {labels.map((label, i) => (
          <span key={`${i}-${label}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

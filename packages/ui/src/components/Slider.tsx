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

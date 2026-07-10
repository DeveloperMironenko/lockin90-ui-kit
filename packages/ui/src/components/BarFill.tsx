import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Fill gradient — one of the `--grad-*` gradient tokens. */
export type BarFillGradient = 'cta' | 'mint' | 'warm' | 'flux' | 'violet';

export interface BarFillProps extends HTMLAttributes<HTMLDivElement> {
  /** 0..1 fill fraction */
  value: number;
  /** when true the bar is filled (set false to animate in via reveal) */
  visible?: boolean;
  /** fill gradient token (default `'cta'` — unchanged legacy look). The design
   *  uses `mint` for healthy coverage/unlimited bars and `warm` for
   *  warn-threshold quota bars (mock `.barfill.q-unlimited` / `.q-warn`). */
  gradient?: BarFillGradient;
}

/** Thin gradient progress bar. Fills to `value` when visible. */
export function BarFill({
  value,
  visible = true,
  gradient = 'cta',
  className,
  style,
  ...rest
}: BarFillProps) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn(
        'lk-barfill',
        gradient !== 'cta' && `lk-barfill--${gradient}`,
        visible && 'is-visible',
        className,
      )}
      style={{ ['--v']: v, ...style } as CSSProperties}
      {...rest}
    >
      <i />
    </div>
  );
}

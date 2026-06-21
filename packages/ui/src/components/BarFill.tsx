import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface BarFillProps extends HTMLAttributes<HTMLDivElement> {
  /** 0..1 fill fraction */
  value: number;
  /** when true the bar is filled (set false to animate in via reveal) */
  visible?: boolean;
}

/** Thin gradient progress bar. Fills to `value` when visible. */
export function BarFill({ value, visible = true, className, style, ...rest }: BarFillProps) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn('lk-barfill', visible && 'is-visible', className)}
      style={{ ['--v']: v, ...style } as CSSProperties}
      {...rest}
    >
      <i />
    </div>
  );
}

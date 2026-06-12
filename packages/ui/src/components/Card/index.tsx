'use client';

import type { HTMLAttributes, ElementType } from 'react';
import { useTilt } from '../motion';
import { cn } from '../../cn';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Lift + glow on hover. */
  hover?: boolean;
  /** Gradient hairline along the top edge. */
  lit?: boolean;
  /** Inner padding scale. */
  pad?: 'sm' | 'md' | 'lg';
  /** Pointer-tilt — `true` for the default 8°, or a number for the max degrees. */
  tilt?: boolean | number;
  as?: ElementType;
}

/** Aurora glass panel — the base surface for everything. */
export default function Card({
  hover = false,
  lit = false,
  pad = 'md',
  tilt = false,
  as,
  className,
  children,
  style,
  ...rest
}: CardProps) {
  const Tag = (as ?? 'div') as ElementType;
  const tiltMax = tilt === true ? 8 : typeof tilt === 'number' ? tilt : 0;
  const t = useTilt(tiltMax || 8);
  const tiltProps = tiltMax
    ? { ref: t.ref, onPointerMove: t.onPointerMove, onPointerLeave: t.onPointerLeave, style: { ...t.style, ...style } }
    : { style };

  return (
    <Tag
      className={cn(
        'lk-card',
        hover && 'lk-hover',
        lit && 'lk-lit',
        pad === 'sm' && 'lk-pad-sm',
        pad === 'lg' && 'lk-pad-lg',
        className,
      )}
      {...tiltProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}

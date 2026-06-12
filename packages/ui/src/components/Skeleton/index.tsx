import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** Corner radius. Ignored when `circle` is set. */
  radius?: number | string;
  /** Render a perfect circle (borderRadius 50%). */
  circle?: boolean;
  className?: string;
}

/** Shimmering placeholder block for loading states. */
export default function Skeleton({ width, height, radius, circle = false, className }: SkeletonProps) {
  const style: CSSProperties = {
    display: 'block',
    width,
    height,
    borderRadius: circle ? '50%' : radius,
  };
  return <span className={cn('lk-skeleton', className)} style={style} aria-hidden />;
}

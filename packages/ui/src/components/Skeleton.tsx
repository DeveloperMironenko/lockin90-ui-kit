import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
}

/** Shimmering placeholder block. */
export function Skeleton({ width, height = 14, radius, className, style, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn('lk-skeleton', className)}
      style={{ width, height, borderRadius: radius, ...style } as CSSProperties}
      {...rest}
    />
  );
}

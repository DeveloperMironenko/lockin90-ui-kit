import type { CSSProperties } from 'react';
import Skeleton from '../Skeleton';
import { cn } from '../../cn';

export interface SkeletonListProps {
  /** Number of skeleton rows to render. Defaults to 3. */
  count?: number;
  /** Row height (any CSS length). Defaults to `72px`. */
  h?: number | string;
  /** Gap between rows (any CSS length). Defaults to `8px`. */
  gap?: number | string;
  className?: string;
}

/** Stacked loading placeholder — renders `count` shimmering `Skeleton` rows. */
export default function SkeletonList({ count = 3, h = '72px', gap = '8px', className }: SkeletonListProps) {
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap,
  };
  return (
    <div className={cn('lk-skeleton-list', className)} style={style}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={h} width="100%" />
      ))}
    </div>
  );
}

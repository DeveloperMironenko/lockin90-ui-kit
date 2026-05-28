import React from 'react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Loading placeholder block. Pass height via className or the h prop shorthand.

interface SkeletonProps {
  h?: string;
  className?: string;
}

export function Skeleton({ h, className }: SkeletonProps) {
  return (
    <div className={`bg-surface border border-border rounded ${h ? `h-[${h}]` : ''} ${className ?? ''}`} />
  );
}

// ─── SkeletonList ─────────────────────────────────────────────────────────────
// Renders n skeleton rows with a gap. Used for list loading states.

interface SkeletonListProps {
  count?: number;
  h?: string;
  gap?: string;
  className?: string;
}

export function SkeletonList({ count = 3, h = '72px', gap = 'gap-2', className }: SkeletonListProps) {
  return (
    <div className={`flex flex-col ${gap} ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} h={h} />
      ))}
    </div>
  );
}

import React from 'react';
import { Mono } from '../Typography';

interface StreakBadgeProps {
  days: number;
  label?: string;
  // Milestone tint: switches color above thresholds (7, 30, 90 days).
  className?: string;
}

function tintFor(days: number): string {
  if (days >= 90) return 'bg-accent/[0.18] border-accent/60 text-accent';
  if (days >= 30) return 'bg-accent/[0.12] border-accent/40 text-accent';
  if (days >= 7) return 'bg-elevated border-border-strong text-white';
  return 'bg-elevated border-border text-secondary';
}

// Number + flame icon, used for journal / mood streaks. Tint escalates at 7, 30, 90 days.
export function StreakBadge({ days, label, className }: StreakBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${tintFor(days)} ${
        className ?? ''
      }`}
      aria-label={label ? `${days} day ${label} streak` : `${days} day streak`}
    >
      <span aria-hidden className="text-base leading-none">🔥</span>
      <Mono color={days >= 30 ? 'accent' : 'white'}>{days}</Mono>
      {label && (
        <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      )}
    </div>
  );
}

export default StreakBadge;

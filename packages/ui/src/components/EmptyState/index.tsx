import React from 'react';
import { Eyebrow } from '../Typography';

// ─── EmptyState ───────────────────────────────────────────────────────────────
// Centered empty state with icon, heading, description, and optional CTA.

interface EmptyStateProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  heading: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, eyebrow, heading, description, action, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-[60px] px-6 text-center gap-4 ${className ?? ''}`}>
      {icon && (
        <div className="w-16 h-16 rounded bg-elevated border border-dashed border-border-strong flex items-center justify-center text-[28px]">
          {icon}
        </div>
      )}
      <div>
        {eyebrow && <Eyebrow className="mb-[6px]">{eyebrow}</Eyebrow>}
        <div className="ea-display text-2xl text-white">{heading}</div>
        <div className="relative overflow-visible my-[6px] w-20 h-1 mx-auto">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-accent -translate-y-1/2 rotate-[-8deg] origin-left" style={{ animation: 'ea-slash-in 600ms var(--ease-power) both' }} />
        </div>
        {description && (
          <p className="text-secondary text-[13px] mt-3 m-0">{description}</p>
        )}
      </div>
      {action && action}
    </div>
  );
}

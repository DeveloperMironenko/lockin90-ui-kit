import React from 'react';

// ─── Badge ────────────────────────────────────────────────────────────────────
// Inline status chip. Used for "COMING SOON", "CONNECTED", "GOOGLE CONNECTED", etc.

type BadgeVariant = 'muted' | 'active' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  muted:  'text-muted',
  active: 'text-accent',
  danger: 'text-accent',
};

export function Badge({ children, variant = 'muted', dot = false, className }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase ${VARIANT_CLASS[variant]} ${className ?? ''}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'active' ? 'bg-accent' : 'bg-muted'}`} />}
      {children}
    </span>
  );
}

// ─── PulseDot ─────────────────────────────────────────────────────────────────
// Animated dot for live sync / active connection status.

export function PulseDot() {
  return <span className="ea-pulse-dot" />;
}

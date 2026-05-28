import React from 'react';

// ─── Eyebrow ─────────────────────────────────────────────────────────────────
// Small all-caps section label. Used before headings and above form sections.

type EyebrowColor = 'secondary' | 'accent' | 'muted';

interface EyebrowProps {
  children: React.ReactNode;
  color?: EyebrowColor;
  className?: string;
}

const EYEBROW_COLOR: Record<EyebrowColor, string> = {
  secondary: 'text-secondary',
  accent:    'text-accent',
  muted:     'text-muted',
};

export function Eyebrow({ children, color = 'secondary', className }: EyebrowProps) {
  return (
    <div className={`ea-eyebrow ${EYEBROW_COLOR[color]} ${className ?? ''}`}>
      {children}
    </div>
  );
}

// ─── Mono ─────────────────────────────────────────────────────────────────────
// Monospace metadata: timestamps, counts, status labels.

type MonoColor = 'secondary' | 'accent' | 'muted' | 'white';

interface MonoProps {
  children: React.ReactNode;
  color?: MonoColor;
  className?: string;
}

const MONO_COLOR: Record<MonoColor, string> = {
  secondary: 'text-secondary',
  accent:    'text-accent',
  muted:     'text-muted',
  white:     'text-white',
};

export function Mono({ children, color = 'muted', className }: MonoProps) {
  return (
    <span className={`ea-mono ${MONO_COLOR[color]} ${className ?? ''}`}>
      {children}
    </span>
  );
}

// ─── Caption ──────────────────────────────────────────────────────────────────
// Smallest text tier. 10px mono for fine metadata (units, sub-labels).

interface CaptionProps {
  children: React.ReactNode;
  color?: 'muted' | 'secondary' | 'white';
  className?: string;
}

export function Caption({ children, color = 'muted', className }: CaptionProps) {
  return (
    <span className={`font-mono text-[10px] tracking-[0.12em] text-${color} ${className ?? ''}`}>
      {children}
    </span>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────
// Standard descriptive text under headings.

interface BodyProps {
  children: React.ReactNode;
  size?: 'sm' | 'base';
  color?: 'secondary' | 'muted' | 'white';
  className?: string;
}

export function Body({ children, size = 'sm', color = 'secondary', className }: BodyProps) {
  return (
    <p className={`text-${color} text-${size} leading-[1.6] m-0 ${className ?? ''}`}>
      {children}
    </p>
  );
}

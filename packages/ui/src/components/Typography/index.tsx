import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

// Aurora text tiers — re-homed from the pre-Aurora kit's Typography module.
// Eyebrow lives in its own component now and is intentionally NOT re-exported here.

// ─── Mono ─────────────────────────────────────────────────────────────────────
// Monospace metadata: timestamps, ids, counts, status labels.

export type MonoColor = 'secondary' | 'accent' | 'muted' | 'white';

export interface MonoProps {
  children: ReactNode;
  /** Text color — defaults to the muted tone. */
  color?: MonoColor;
  className?: string;
}

const MONO_COLOR: Record<MonoColor, string> = {
  secondary: 'var(--text-dim)',
  accent: 'var(--accent)',
  muted: 'var(--text-faint)',
  white: 'var(--text)',
};

/** Small monospace inline text for ids, timestamps, codes, and counts. */
export function Mono({ children, color = 'muted', className }: MonoProps) {
  const style: CSSProperties = { color: MONO_COLOR[color] };
  return (
    <span className={cn('lk-mono', className)} style={style}>
      {children}
    </span>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────
// Standard descriptive paragraph text under headings.

export type BodySize = 'sm' | 'base';
export type BodyColor = 'secondary' | 'muted' | 'white';

export interface BodyProps {
  children: ReactNode;
  /** Font size tier — defaults to `sm`. */
  size?: BodySize;
  /** Text color — defaults to the secondary tone. */
  color?: BodyColor;
  className?: string;
}

const BODY_COLOR: Record<BodyColor, string> = {
  secondary: 'var(--text-dim)',
  muted: 'var(--text-faint)',
  white: 'var(--text)',
};

const BODY_SIZE: Record<BodySize, string> = {
  sm: '13px',
  base: '15px',
};

/** Descriptive paragraph copy. Renders a `<p>`. */
export function Body({ children, size = 'sm', color = 'secondary', className }: BodyProps) {
  const style: CSSProperties = {
    color: BODY_COLOR[color],
    fontSize: BODY_SIZE[size],
    lineHeight: 1.6,
    margin: 0,
  };
  return (
    <p className={cn('lk-body', className)} style={style}>
      {children}
    </p>
  );
}

// ─── Caption ──────────────────────────────────────────────────────────────────
// Smallest text tier — fine mono metadata (units, sub-labels).

export type CaptionColor = 'muted' | 'secondary' | 'white';

export interface CaptionProps {
  children: ReactNode;
  /** Text color — defaults to the muted tone. */
  color?: CaptionColor;
  className?: string;
}

const CAPTION_COLOR: Record<CaptionColor, string> = {
  muted: 'var(--text-faint)',
  secondary: 'var(--text-dim)',
  white: 'var(--text)',
};

/** Tiny mono metadata text — the smallest tier, for units and sub-labels. */
export function Caption({ children, color = 'muted', className }: CaptionProps) {
  const style: CSSProperties = { color: CAPTION_COLOR[color] };
  return (
    <span className={cn('lk-caption', className)} style={style}>
      {children}
    </span>
  );
}

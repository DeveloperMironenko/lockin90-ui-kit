import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

/** Back-compat variant vocabulary from the pre-Aurora kit (admin app). */
export type BadgeVariant = 'muted' | 'active' | 'accent' | 'ok' | 'warn' | 'bad';

const VARIANT_COLOR: Record<BadgeVariant, string> = {
  muted: 'var(--text-faint)',
  active: 'var(--accent)',
  accent: 'var(--accent)',
  ok: 'var(--zone-high)',
  warn: 'var(--zone-mid)',
  bad: 'var(--zone-low)',
};

export interface BadgeProps {
  children: ReactNode;
  /** Back-compat tone (admin app). Tints the label + dot. */
  variant?: BadgeVariant;
  /** Back-compat: show a leading status dot (admin app). */
  dot?: boolean;
  className?: string;
}

/** Tiny mono, uppercase, tracked micro-label — lighter than a Chip. */
export default function Badge({ children, variant, dot = false, className }: BadgeProps) {
  const style: CSSProperties | undefined = variant ? { color: VARIANT_COLOR[variant] } : undefined;
  return (
    <span className={cn('lk-badge', className)} style={style}>
      {dot && (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: variant ? VARIANT_COLOR[variant] : 'var(--text-faint)',
            display: 'inline-block',
            marginRight: 5,
          }}
        />
      )}
      {children}
    </span>
  );
}

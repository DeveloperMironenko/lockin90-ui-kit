import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { RolloutScopeBadgeProps, RolloutScopeKind } from './types';

// scope → mono label + signal color/border/background (Aurora chip styling).
const TONE: Record<RolloutScopeKind, { color: string; border: string; bg: string }> = {
  user_list: { color: 'var(--zone-mid)', border: 'rgba(255,176,32,.4)', bg: 'rgba(255,176,32,.1)' },
  standard_users: { color: 'var(--text)', border: 'var(--border-2)', bg: 'var(--glass-2)' },
  all_users: { color: 'var(--zone-high)', border: 'rgba(52,245,197,.4)', bg: 'rgba(52,245,197,.1)' },
};

/** Aurora badge for an estimation-system rollout scope (canary / standard / all). */
export default function RolloutScopeBadge({ scope, userCount, className }: RolloutScopeBadgeProps) {
  const label =
    scope === 'user_list'
      ? `canary${userCount != null ? ` · ${userCount}` : ''}`
      : scope === 'standard_users'
        ? 'standard'
        : 'all users';
  const t = TONE[scope];
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 9px',
    borderRadius: 'var(--r-sm)',
    border: '1px solid',
    borderColor: t.border,
    background: t.bg,
    color: t.color,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };
  return (
    <span className={cn('lk-rollout-badge', className)} style={style}>
      {label}
    </span>
  );
}

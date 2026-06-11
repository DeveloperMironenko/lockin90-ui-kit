import type { RolloutScopeBadgeProps } from './types';

export default function RolloutScopeBadge({ scope, userCount, className }: RolloutScopeBadgeProps) {
  const label =
    scope === 'user_list'
      ? `canary${userCount != null ? ` · ${userCount}` : ''}`
      : scope === 'standard_users'
        ? 'standard'
        : 'all users';
  const tone =
    scope === 'user_list'
      ? 'text-[#FFB020] border-[#FFB020]/40 bg-[#FFB020]/10'
      : scope === 'standard_users'
        ? 'text-white border-border-strong bg-elevated'
        : 'text-[#34F5C5] border-[#34F5C5]/40 bg-[#34F5C5]/10';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] tracking-[0.14em] uppercase ${tone} ${className ?? ''}`}
    >
      {label}
    </span>
  );
}

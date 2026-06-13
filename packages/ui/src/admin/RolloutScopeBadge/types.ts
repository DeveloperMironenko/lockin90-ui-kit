export type RolloutScopeKind = 'user_list' | 'standard_users' | 'all_users';

export interface RolloutScopeBadgeProps {
  scope: RolloutScopeKind;
  /** Number of users in the scope. For `user_list` we display "canary N". */
  userCount?: number | null;
  className?: string;
}

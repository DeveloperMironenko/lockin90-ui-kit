import type { AuditEntryProps } from './types';

// Color audit actions by intent so the eye can scan a long log at a glance.
// Destructive (delete/suspend/reset/etc.) → accent red; creates/grants → green;
// mutations (change/update/toggle/impersonate) → amber; reads/generic → white.
function actionColor(action: string): string {
  const a = action.toLowerCase();
  if (/delete|suspend|reset|remove|revoke|expire|kill|drain|rollback/.test(a)) {
    return 'text-accent';
  }
  if (/create|grant|approve|enable|publish|add|register/.test(a)) {
    return 'text-green-zone';
  }
  if (/change|update|edit|patch|toggle|recompute|impersonate|adjust|flip|apply|queue/.test(a)) {
    return 'text-amber-zone';
  }
  return 'text-white';
}

export default function AuditEntry({
  timestamp,
  adminEmail,
  action,
  targetLabel,
  summary,
  className,
}: AuditEntryProps) {
  return (
    <div className={`flex items-start gap-3 py-2.5 border-b border-border-subtle last:border-0 ${className ?? ''}`}>
      <span className="font-mono text-[10px] text-muted tracking-[0.04em] shrink-0 mt-0.5 w-[110px]">
        {timestamp}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-white leading-tight">
          <span className="text-secondary">{adminEmail}</span>
          <span className="mx-1.5 text-muted">·</span>
          <span className={`font-display italic font-bold text-[11px] uppercase tracking-[0.08em] ${actionColor(action)}`}>{action}</span>
          <span className="mx-1.5 text-muted">·</span>
          <span className="font-mono text-[11px] text-white">{targetLabel}</span>
        </div>
        <div className="text-[11px] text-secondary mt-0.5">{summary}</div>
      </div>
    </div>
  );
}

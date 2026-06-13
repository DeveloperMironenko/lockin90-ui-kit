import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { AuditEntryProps } from './types';

// Color audit actions by intent so the eye can scan a long log at a glance.
// Destructive (delete/suspend/reset/etc.) → accent red; creates/grants → green;
// mutations (change/update/toggle/impersonate) → amber; reads/generic → white.
function actionColor(action: string): string {
  const a = action.toLowerCase();
  if (/delete|suspend|reset|remove|revoke|expire|kill|drain|rollback/.test(a)) {
    return 'var(--bad)';
  }
  if (/create|grant|approve|enable|publish|add|register/.test(a)) {
    return 'var(--zone-high)';
  }
  if (/change|update|edit|patch|toggle|recompute|impersonate|adjust|flip|apply|queue/.test(a)) {
    return 'var(--zone-mid)';
  }
  return 'var(--text)';
}

/** A single audit-log row: timestamp · actor · action · target + a summary line. */
export default function AuditEntry({
  timestamp,
  adminEmail,
  action,
  targetLabel,
  summary,
  className,
}: AuditEntryProps) {
  const row: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  };
  const ts: CSSProperties = {
    flex: '0 0 auto',
    width: 110,
    marginTop: 2,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.04em',
    color: 'var(--text-faint)',
  };
  const main: CSSProperties = { minWidth: 0, flex: 1 };
  const headline: CSSProperties = { fontSize: 12, lineHeight: 1.3, color: 'var(--text)' };
  const sep: CSSProperties = { margin: '0 6px', color: 'var(--text-faint)' };
  const actor: CSSProperties = { color: 'var(--text-dim)' };
  const act: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: actionColor(action),
  };
  const target: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text)',
  };
  const sum: CSSProperties = { marginTop: 2, fontSize: 11, color: 'var(--text-dim)' };

  return (
    <div className={cn('lk-audit-entry', className)} style={row}>
      <span className="lk-mono" style={ts}>
        {timestamp}
      </span>
      <div style={main}>
        <div style={headline}>
          <span style={actor}>{adminEmail}</span>
          <span style={sep}>·</span>
          <span style={act}>{action}</span>
          <span style={sep}>·</span>
          <span style={target}>{targetLabel}</span>
        </div>
        <div style={sum}>{summary}</div>
      </div>
    </div>
  );
}

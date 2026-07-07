import type { ReactNode } from 'react';
import { cn } from '../cn';
import { Avatar } from '../components/Avatar';

/* AuditEntry — one row of the operator audit feed: timestamp, an actor (avatar + name) plus a
   free-form description, and a trailing status chip. Mirrors `.feed-row` from
   lockin90-design/admin/overview.html. Web-only. `lk-audit*` classes. The caller supplies the
   trailing chip (usually a StatusChip) and the description nodes. */

export interface AuditEntryProps {
  /** Left column — a short timestamp, e.g. "14:02:11Z". */
  timestamp: string;
  /** Actor display name, e.g. "miron". Rendered bold after the avatar. */
  actor: string;
  /** Actor avatar initials, e.g. "MN". Falls back to deriving from `actor`. */
  actorInitials?: string;
  /** The action description — free nodes after the actor, e.g. "granted 100 credits …". */
  children: ReactNode;
  /** Trailing signal chip (usually a StatusChip). */
  chip?: ReactNode;
  className?: string;
}

/** One audit-feed row: timestamp · actor + description · trailing chip. */
export function AuditEntry({ timestamp, actor, actorInitials, children, chip, className }: AuditEntryProps) {
  return (
    <div className={cn('lk-audit', className)}>
      <span className="lk-audit-ts">{timestamp}</span>
      <span className="lk-audit-desc">
        <span className="lk-audit-actor">
          <Avatar name={actor} initials={actorInitials} size={18} />
          <b>{actor}</b>
        </span>{' '}
        {children}
      </span>
      {chip != null && <span className="lk-audit-chip">{chip}</span>}
    </div>
  );
}

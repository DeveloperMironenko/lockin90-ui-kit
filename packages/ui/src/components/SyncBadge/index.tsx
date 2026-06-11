import Pulse from '../Pulse';

export type SyncStatus = 'synced' | 'syncing' | 'error';

export interface SyncBadgeProps {
  status?: SyncStatus;
  /** Override the default status text. */
  label?: string;
  /** Trailing time, e.g. "2m ago". */
  time?: string;
  className?: string;
}

const TONE: Record<SyncStatus, 'ok' | 'warn' | 'bad'> = {
  synced: 'ok',
  syncing: 'warn',
  error: 'bad',
};

const DEFAULT_LABEL: Record<SyncStatus, string> = {
  synced: 'Synced',
  syncing: 'Syncing…',
  error: 'Sync failed',
};

/** Compact wearable/data sync status — a live pulse dot plus a mono label. */
export default function SyncBadge({ status = 'synced', label, time, className = '' }: SyncBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] ${className}`.trim()}>
      <Pulse tone={TONE[status]} />
      <span style={{ color: 'var(--text-secondary)' }}>
        {label ?? DEFAULT_LABEL[status]}
        {time && (
          <>
            {' · '}
            <span style={{ color: 'var(--text-muted)' }}>{time}</span>
          </>
        )}
      </span>
    </span>
  );
}

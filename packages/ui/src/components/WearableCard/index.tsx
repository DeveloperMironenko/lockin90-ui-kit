import type { ReactNode } from 'react';
import Card from '../Card';
import BarFill from '../BarFill';
import { cn } from '../../cn';

export interface WearableProgress {
  /** Caption above the bar, e.g. "Syncing history". */
  label?: ReactNode;
  /** Progress fraction 0..1. */
  value: number;
}

export interface WearableCardProps {
  /** Brand mark / device logo. */
  logo?: ReactNode;
  /** Device name, e.g. "Oura Ring". */
  name: ReactNode;
  /** Status text shown beside the pulse dot. */
  status?: ReactNode;
  /** Green dot + green status when connected; warm + dim otherwise. */
  connected?: boolean;
  /** Right-aligned action — pass a <Button size="sm" />. */
  action?: ReactNode;
  /** Optional pull/sync progress bar under the status. */
  progress?: WearableProgress;
  className?: string;
}

/** A device-connection row: logo box, name + live status, optional sync bar, action. */
export default function WearableCard({
  logo,
  name,
  status,
  connected = false,
  action,
  progress,
  className,
}: WearableCardProps) {
  return (
    <Card lit className={cn(className)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--glass-2)',
          border: '1px solid var(--border)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {logo}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{name}</div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12.5,
            color: connected ? 'var(--zone-high)' : 'var(--text-dim)',
          }}
        >
          <span className={cn('lk-pulse', !connected && 'lk-warn')} style={{ width: 6, height: 6 }} />
          {status}
        </span>

        {progress && (
          <div style={{ marginTop: 4 }}>
            <div
              className="lk-mono"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 9,
                color: 'var(--text-faint)',
                marginBottom: 4,
              }}
            >
              <span>{progress.label}</span>
              <span>{Math.round(progress.value * 100)}%</span>
            </div>
            <BarFill value={progress.value} tone="pos" />
          </div>
        )}
      </div>

      {action && <div style={{ alignSelf: 'center', flexShrink: 0 }}>{action}</div>}
    </Card>
  );
}

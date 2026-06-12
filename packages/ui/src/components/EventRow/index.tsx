import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface EventRowProps {
  /** Leading icon inside the glass badge. */
  icon?: ReactNode;
  /** Event title. */
  title: ReactNode;
  /** Secondary description line. */
  subtitle?: ReactNode;
  /** Right-aligned timestamp. */
  time?: ReactNode;
  className?: string;
}

/** Recent-event timeline row: icon badge + title/subtitle + monospace time. */
export default function EventRow({ icon, title, subtitle, time, className }: EventRowProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: 'var(--glass)',
          border: '1px solid var(--border)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color: 'var(--text)',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{subtitle}</div>}
      </div>
      {time != null && (
        <div className="lk-mono" style={{ fontSize: 11, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
          {time}
        </div>
      )}
    </div>
  );
}

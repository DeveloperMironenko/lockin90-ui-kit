import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface PlanItemProps {
  /** Leading icon inside the glass badge. */
  icon?: ReactNode;
  /** Item title. */
  title: ReactNode;
  /** Secondary description line. */
  subtitle?: ReactNode;
  /** Completed → filled check; otherwise a dashed empty circle. */
  done?: boolean;
  className?: string;
}

/** Coach-plan / checklist row: icon badge + title/subtitle + done indicator. */
export default function PlanItem({ icon, title, subtitle, done = false, className }: PlanItemProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '13px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
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
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{subtitle}</div>}
      </div>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          border: done ? '1.5px solid var(--zone-high)' : '1.5px dashed var(--border-2)',
          background: done ? 'rgba(52,245,197,.14)' : 'transparent',
        }}
      >
        {done && (
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'var(--zone-high)', strokeWidth: 2.4, fill: 'none' }}>
            <path d="M5 12l5 5L20 6" />
          </svg>
        )}
      </span>
    </div>
  );
}

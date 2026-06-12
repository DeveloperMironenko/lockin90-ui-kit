import type { ReactNode } from 'react';
import BarFill from '../BarFill';
import { cn } from '../../cn';

export interface ContributionRowProps {
  /** Contributor name. */
  name: ReactNode;
  /** Secondary description line. */
  description?: ReactNode;
  /** Signed contribution value (e.g. +12 or -9). */
  value: number;
  /** Bar magnitude, 0..1. */
  fill: number;
  className?: string;
}

/** Score-breakdown row: name/description + signed value + magnitude bar. */
export default function ContributionRow({ name, description, value, fill, className }: ContributionRowProps) {
  const positive = value >= 0;
  return (
    <div
      className={cn(className)}
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '13px 4px',
        display: 'grid',
        gridTemplateColumns: '1fr 56px 1fr',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
        {description && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 5 }}>{description}</div>}
      </div>
      <div
        className="lk-mono"
        style={{
          fontWeight: 600,
          fontSize: 16,
          textAlign: 'right',
          color: positive ? 'var(--zone-high)' : 'var(--zone-low)',
        }}
      >
        {positive ? `+${value}` : value}
      </div>
      <BarFill value={Math.abs(fill)} tone={positive ? 'pos' : 'neg'} />
    </div>
  );
}

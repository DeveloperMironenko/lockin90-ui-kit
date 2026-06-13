import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { VersionStatus, VersionStatusPillProps } from './types';

// status → mono label + signal color (energy-zone tokens / accent / dim).
const TONE: Record<VersionStatus, { label: string; color: string }> = {
  canary: { label: 'canary', color: 'var(--zone-mid)' },
  standard: { label: 'standard', color: 'var(--text)' },
  all: { label: 'all users', color: 'var(--zone-high)' },
  rolled_back: { label: 'rolled back', color: 'var(--accent)' },
  inactive: { label: 'inactive', color: 'var(--text-faint)' },
};

/** Aurora status pill for an estimation-system version row. */
export default function VersionStatusPill({ status, className }: VersionStatusPillProps) {
  const t = TONE[status];
  const rowStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: t.color,
  };
  const dotStyle: CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor',
    boxShadow: '0 0 8px currentColor',
    flex: '0 0 auto',
  };
  return (
    <span className={cn('lk-version-pill', className)} style={rowStyle}>
      <span style={dotStyle} aria-hidden />
      {t.label}
    </span>
  );
}

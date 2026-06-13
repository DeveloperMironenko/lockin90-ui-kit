import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { StatBlockProps } from './types';

export type { StatBlockProps } from './types';

/** A small mono-labelled stat — uppercase label over a large display value. */
export default function StatBlock({ label, value, unit, className }: StatBlockProps) {
  const labelStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--text-faint)',
  };
  const valueStyle: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 24,
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    fontVariantNumeric: 'tabular-nums',
  };
  const unitStyle: CSSProperties = {
    marginLeft: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-dim)',
  };

  return (
    <div className={cn(className)} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={labelStyle}>{label}</div>
      <div>
        <span style={valueStyle}>{value}</span>
        {unit && <span style={unitStyle}>{unit}</span>}
      </div>
    </div>
  );
}

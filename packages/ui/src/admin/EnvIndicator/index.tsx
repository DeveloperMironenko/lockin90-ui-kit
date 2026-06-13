import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { Env, EnvIndicatorProps } from './types';

// env → signal color/border (DEV dim, STAGING amber, PROD accent).
const TONE: Record<Env, { color: string; border: string }> = {
  DEV: { color: 'var(--text-dim)', border: 'var(--border-2)' },
  STAGING: { color: 'var(--zone-mid)', border: 'rgba(255,176,32,.4)' },
  PROD: { color: 'var(--accent)', border: 'rgba(124,92,255,.5)' },
};

/** Aurora environment indicator — which deploy the operator is looking at. */
export default function EnvIndicator({ env, className }: EnvIndicatorProps) {
  const t = TONE[env];
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 9px',
    borderRadius: 'var(--r-sm)',
    border: '1px solid',
    borderColor: t.border,
    color: t.color,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
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
    <div className={cn('lk-env', className)} style={style}>
      <span style={dotStyle} aria-hidden />
      {env}
    </div>
  );
}

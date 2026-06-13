import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

export type BannerTone = 'info' | 'warn' | 'bad' | 'ok';

export interface BannerProps {
  /** Visual tone — drives color, border, and background. Defaults to `info`. */
  tone?: BannerTone;
  /** Leading icon node. */
  icon?: ReactNode;
  children: ReactNode;
  /** Trailing action node (pushed to the far right). */
  action?: ReactNode;
  className?: string;
}

interface ToneStyle {
  color: string;
  border: string;
  bg: string;
}

const TONE: Record<BannerTone, ToneStyle> = {
  info: { color: 'var(--info)', border: 'rgba(110,123,255,.3)', bg: 'rgba(110,123,255,.08)' },
  warn: { color: 'var(--warn)', border: 'rgba(255,176,32,.3)', bg: 'rgba(255,176,32,.08)' },
  bad: { color: 'var(--bad)', border: 'rgba(255,77,109,.3)', bg: 'rgba(255,77,109,.08)' },
  ok: { color: 'var(--ok)', border: 'rgba(52,245,197,.3)', bg: 'rgba(52,245,197,.08)' },
};

/** Full-width inline alert — impersonation, coach-paused, env, or info notices. */
export default function Banner({ tone = 'info', icon, children, action, className }: BannerProps) {
  const t = TONE[tone];
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    padding: '11px 15px',
    borderRadius: 'var(--r)',
    border: '1px solid',
    borderColor: t.border,
    background: t.bg,
    color: 'var(--text)',
    fontSize: 13.5,
  };

  return (
    <div
      role={tone === 'bad' || tone === 'warn' ? 'alert' : 'status'}
      className={cn(className)}
      style={style}
    >
      {/* 3px tone-colored vertical accent bar — matches the native
          @lockin90/ui-native Banner so web ≡ mobile. */}
      <span
        aria-hidden
        style={{
          alignSelf: 'stretch',
          flex: 'none',
          width: 3,
          borderRadius: 999,
          background: t.color,
        }}
      />
      {icon && (
        <span aria-hidden style={{ display: 'inline-flex', color: t.color }}>
          {icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
      {action && <span style={{ marginLeft: 'auto' }}>{action}</span>}
    </div>
  );
}

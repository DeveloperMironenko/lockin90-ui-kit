import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

export type AlertVariant = 'error' | 'success' | 'info';

export interface AlertProps {
  /** Visual tone — drives color, border, and background. */
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

interface VariantStyle {
  color: string;
  border: string;
  bg: string;
}

const VARIANT: Record<AlertVariant, VariantStyle> = {
  error: { color: 'var(--bad)', border: 'rgba(255,77,109,.3)', bg: 'rgba(255,77,109,.08)' },
  success: { color: 'var(--ok)', border: 'rgba(52,245,197,.3)', bg: 'rgba(52,245,197,.08)' },
  info: { color: 'var(--text-dim)', border: 'var(--border)', bg: 'var(--glass)' },
};

/** Compact mono message box — form errors, inline notices, confirmations. */
export default function Alert({ variant, children, className }: AlertProps) {
  const v = VARIANT[variant];
  const style: CSSProperties = {
    padding: '10px 14px',
    border: '1px solid',
    borderColor: v.border,
    borderRadius: 'var(--r-sm)',
    background: v.bg,
    color: variant === 'info' ? 'var(--text-dim)' : v.color,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    lineHeight: 1.5,
  };

  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={cn(className)} style={style}>
      {children}
    </div>
  );
}

import React from 'react';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<AlertVariant, string> = {
  error:   'bg-accent/[0.08] border-accent/30 text-accent',
  success: 'bg-white/5 border-border-strong text-white tracking-[0.04em]',
  info:    'bg-elevated border-border text-secondary',
};

export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div className={`px-[14px] py-[10px] border rounded font-mono text-[11px] ${VARIANT_CLASS[variant]} ${className ?? ''}`}>
      {children}
    </div>
  );
}

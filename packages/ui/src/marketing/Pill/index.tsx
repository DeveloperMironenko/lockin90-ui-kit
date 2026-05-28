import React from 'react';
import { cn } from '../_cn';

export function Pill({
  children,
  variant = 'default',
  dot = false,
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('ea-pill', variant === 'accent' && 'ea-pill-accent', className)}>
      {dot && <span className="ea-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}

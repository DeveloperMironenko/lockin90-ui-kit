import React from 'react';
import { cn } from '../_cn';

export function Stat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="ea-num text-5xl sm:text-6xl text-white">{value}</div>
      <div className="ea-eyebrow text-secondary">{label}</div>
    </div>
  );
}

import React from 'react';
import { Icon, type IconName } from '../Icon';
import { cn } from '../_cn';

export function IconBadge({
  name,
  accent = false,
  className,
}: {
  name: IconName;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-md border',
        accent ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-elevated text-white',
        className,
      )}
    >
      <Icon name={name} size={22} />
    </span>
  );
}

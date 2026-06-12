'use client';

import type { SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  /** The `<option>` elements to render. */
  children: ReactNode;
  className?: string;
}

/** Aurora native `<select>` (mono). Controlled via native `value`/`onChange`. */
export default function Select({ children, className, ...rest }: SelectProps) {
  return (
    <select className={cn('lk-select', className)} {...rest}>
      {children}
    </select>
  );
}

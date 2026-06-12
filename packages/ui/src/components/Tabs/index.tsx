'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '../../cn';

export interface TabItem {
  value: string;
  label: ReactNode;
}

export interface TabsProps {
  items: Array<TabItem>;
  /** Controlled selected value. Omit to use internal state. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** Horizontal pill tabs. Controlled when `value` is given, else self-managed. */
export default function Tabs({ items, value, defaultValue, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? items[0]?.value);
  const current = value !== undefined ? value : internal;

  function select(next: string) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <div className={cn('lk-tabs', className)} role="tablist">
      {items.map((it) => {
        const active = it.value === current;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn('lk-tab', active && 'lk-active')}
            onClick={() => select(it.value)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

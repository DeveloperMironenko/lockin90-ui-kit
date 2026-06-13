'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '../../cn';

export interface TabItem {
  value: string;
  label: ReactNode;
}

/** Back-compat tab shape: accepts either `id` or `value` for the key. */
export interface LegacyTabItem {
  id?: string;
  value?: string;
  label: ReactNode;
}

export interface TabsProps {
  items?: Array<TabItem>;
  /** Back-compat alias for `items`; entries may use `id` instead of `value`. */
  tabs?: Array<LegacyTabItem>;
  /** Controlled selected value. Omit to use internal state. */
  value?: string;
  /** Back-compat alias for `value` (controlled selected value). */
  active?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** Horizontal pill tabs. Controlled when `value`/`active` is given, else self-managed. */
export default function Tabs({ items, tabs, value, active, defaultValue, onChange, className }: TabsProps) {
  const list: Array<TabItem> = (tabs ?? items ?? []).map((t) => ({
    value: (t as LegacyTabItem).id ?? (t.value as string),
    label: t.label,
  }));
  const controlledValue = active ?? value;
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? list[0]?.value);
  const current = controlledValue !== undefined ? controlledValue : internal;

  function select(next: string) {
    if (controlledValue === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <div className={cn('lk-tabs', className)} role="tablist">
      {list.map((it) => {
        const isActive = it.value === current;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn('lk-tab', isActive && 'lk-active')}
            onClick={() => select(it.value)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

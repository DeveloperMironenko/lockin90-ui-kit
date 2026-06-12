'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export interface AccordionItem {
  q: ReactNode;
  a: ReactNode;
}

export interface AccordionProps {
  items: Array<AccordionItem>;
  className?: string;
}

/** Single-open FAQ accordion. Clicking the open item collapses it. */
export default function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn(className)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <Card key={i} pad="sm">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 600,
                padding: 0,
                textAlign: 'left',
              }}
            >
              <span>{it.q}</span>
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform .3s var(--ease)',
                }}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              aria-hidden={!isOpen}
              style={{
                maxHeight: isOpen ? 'none' : 0,
                overflow: 'hidden',
                transition: 'all .3s',
                color: 'var(--text-dim)',
                fontSize: 14,
                marginTop: isOpen ? 10 : 0,
              }}
            >
              {it.a}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

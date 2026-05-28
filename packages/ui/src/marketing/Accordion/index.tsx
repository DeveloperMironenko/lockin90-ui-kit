'use client';

import React, { useState } from 'react';
import { cn } from '../_cn';

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-white"
            >
              <span
                className={cn(
                  'ea-display-upright text-lg sm:text-xl',
                  isOpen ? 'text-white' : 'text-secondary',
                )}
              >
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  'shrink-0 text-2xl leading-none text-accent transition-transform duration-300',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose text-base leading-relaxed text-secondary">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

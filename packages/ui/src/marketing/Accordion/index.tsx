'use client';

import { useState } from 'react';
import { cn } from '../../cn';

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
}

/**
 * Single-open FAQ accordion. The first row is open by default; clicking a row
 * toggles it (and closes any other). Aurora glass dividers + a rotating
 * accent "+" indicator.
 */
export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="lk-accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="lk-accordion-item">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className={cn('lk-accordion-trigger', isOpen && 'lk-open')}
            >
              <span className="lk-accordion-q">{item.question}</span>
              <span aria-hidden className={cn('lk-accordion-sign', isOpen && 'lk-open')}>
                +
              </span>
            </button>
            <div className={cn('lk-accordion-panel', isOpen && 'lk-open')}>
              <div className="lk-accordion-panel-inner">
                <p className="lk-accordion-a">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface AccordionItemData {
  /** Header row label. */
  title: string;
  /** Body content revealed when the item is open. */
  content: ReactNode;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Disclosure rows. Defaults to a small FAQ sample. */
  items?: AccordionItemData[];
  /** Allow several rows open at once. Default false (single-open). */
  multiple?: boolean;
  /** Index open on mount. Default 0. */
  defaultOpen?: number;
}

const DEFAULT_ITEMS: AccordionItemData[] = [
  { title: 'How accurate are the estimates?', content: 'They improve as you log more sessions.' },
  { title: 'Can I cancel anytime?', content: 'Yes — your plan stays active until the end of the period.' },
  { title: 'Do you support wearables?', content: 'WHOOP, Oura, Apple Health and more.' },
];

/** Collapsible disclosure list — a header row with a chevron that rotates open
 *  while the body expands. Used for FAQ and settings sections. */
export function Accordion({
  items = DEFAULT_ITEMS,
  multiple = false,
  defaultOpen = 0,
  className,
  ...rest
}: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen >= 0 && defaultOpen < items.length ? [defaultOpen] : []),
  );

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <div className={cn('lk-acc', className)} {...rest}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={cn('lk-acc-item', isOpen && 'is-open')}>
            <button
              type="button"
              className="lk-acc-head"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              <span className="lk-acc-title">{item.title}</span>
              <svg
                className="lk-acc-chev"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="lk-acc-body" role="region">
              <div className="lk-acc-content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

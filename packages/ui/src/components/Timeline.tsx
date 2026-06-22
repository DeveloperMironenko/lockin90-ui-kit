import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';
import { Pulse } from './Pulse';

export type TimelineStatus = 'done' | 'now' | 'next';

export interface TimelineItem {
  /** Milestone heading. */
  title: string;
  /** Optional time/date label, e.g. "Today", "In 2 months", "Q3 2026". */
  date?: string;
  /** Optional supporting copy. */
  description?: ReactNode;
  /** Milestone state — drives the dot + chip styling. */
  status?: TimelineStatus;
  /** Override the status chip text (defaults: Done / In progress / Next). */
  statusLabel?: string;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items?: TimelineItem[];
}

const CHIP_TONE = { done: 'high', now: 'accent', next: 'mid' } as const;
const DEFAULT_LABEL = { done: 'Done', now: 'In progress', next: 'Next' } as const;

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0A12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DEFAULT_ITEMS: TimelineItem[] = [
  { status: 'done', title: 'Model calibrated', date: 'Shipped', description: 'Energy & recovery model trained and validated against real wearable data.' },
  { status: 'done', title: 'Wearables connected', date: 'Shipped', description: 'Oura, WHOOP, Apple Health, Health Connect and Garmin sync built end-to-end.' },
  { status: 'now', title: 'Closed beta', date: 'Today', description: 'Polishing the experience with founding athletes right now.' },
  { status: 'next', title: 'Public launch', date: 'In 2 months', description: 'Doors open to the waitlist first. Get your invite the second we go live.' },
];

/** Vertical milestone timeline — done → now → next, each with a time/date label
 *  and a status chip. The "coming soon" / roadmap component. */
export function Timeline({ items = DEFAULT_ITEMS, className, ...rest }: TimelineProps) {
  return (
    <ol className={cn('lk-timeline', className)} {...rest}>
      {items.map((it, i) => {
        const status = it.status ?? 'next';
        return (
          <li key={i} className={cn('lk-tl-item', `is-${status}`)}>
            <span className="lk-tl-dot" aria-hidden="true">
              {status === 'done' ? CHECK : status === 'now' ? <Pulse /> : null}
            </span>
            <div className="lk-tl-body">
              <div className="lk-tl-top">
                <h3 className="lk-tl-title">{it.title}</h3>
                {it.date ? <span className="lk-tl-date">{it.date}</span> : null}
                <Chip tone={CHIP_TONE[status]} dot>
                  {it.statusLabel ?? DEFAULT_LABEL[status]}
                </Chip>
              </div>
              {it.description ? <p className="lk-tl-desc">{it.description}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

'use client';

import type { CSSProperties } from 'react';
import EnergyRing from '../EnergyRing';
import { cn } from '../../cn';

export interface CalendarDay {
  /** Day-of-month number (or any short label). */
  date: string | number;
  /** Three-letter day-of-week, e.g. "Wed". */
  dow: string;
  /** Energy score 0–100 for the mini ring. */
  score: number;
  /** Highlight as the selected/current day. */
  today?: boolean;
}

export interface CalendarStripProps {
  days: Array<CalendarDay>;
  /** When given, each cell becomes a focusable button reporting its index. */
  onSelect?: (index: number) => void;
  className?: string;
}

/** A horizontal week strip of tiny energy rings — one cell per day. */
export default function CalendarStrip({ days, onSelect, className }: CalendarStripProps) {
  return (
    <div
      className={cn(className)}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 8 }}
    >
      {days.map((d, i) => {
        const cellStyle: CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 7,
          padding: '10px 4px',
          borderRadius: 'var(--r-sm)',
          border: '1px solid transparent',
          cursor: onSelect ? 'pointer' : undefined,
          ...(d.today
            ? { background: 'rgba(124,92,255,.10)', borderColor: 'rgba(124,92,255,.3)' }
            : null),
        };
        return (
          <div
            key={i}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onClick={onSelect ? () => onSelect(i) : undefined}
            onKeyDown={
              onSelect
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(i);
                    }
                  }
                : undefined
            }
            style={cellStyle}
          >
            <div
              className="lk-mono"
              style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase' }}
            >
              {d.dow}
            </div>
            <EnergyRing
              score={d.score}
              size={46}
              stroke={5}
              gradient="zone"
              showValue={false}
              showZone={false}
              sub={null}
            />
            <div
              className="lk-mono"
              style={{ fontSize: 11, color: d.today ? 'var(--text)' : 'var(--text-dim)' }}
            >
              {d.date}
            </div>
          </div>
        );
      })}
    </div>
  );
}

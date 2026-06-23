import type { ReactNode } from 'react';
import { cn } from '../cn';

/* PulseStrip (LiveStatBar) — the horizontal operational "live ingest" strip
   from lockin90-design/admin/wearables.html (`.pulse-strip`): a glass bar that,
   when live, shows a pinging LIVE dot + a row of animated equalizer bars, a set
   of swatch-dotted mono stats, and an optional right-aligned slot. When idle the
   equalizer is frozen + dimmed. Pure-CSS animation (no JS) → no 'use client'.
   Web-only (admin has no native surface). */

/** A single labelled stat: a colored swatch dot + mono label + value. */
export interface PulseStripItem {
  /** Swatch dot color — a token var (e.g. `var(--ok)`) or hex. */
  swatch: string;
  /** Mono label rendered before the value (e.g. "p95 ingest"). */
  label: string;
  /** Emphasised mono value (e.g. "214 ms"). */
  value: string;
}

export interface PulseStripProps {
  /** `live` pings the dot + animates the equalizer; `idle` freezes + dims it. */
  state: 'live' | 'idle';
  /** Swatch-dotted stats rendered across the strip. */
  items: PulseStripItem[];
  /** Show the animated equalizer bars. @default true when `live`, false when `idle` */
  equalizer?: boolean;
  /** Optional right-aligned slot (e.g. a queue depth / timestamp / action). */
  right?: ReactNode;
  /** Extra class names on the strip root. */
  className?: string;
}

/* Eight bars with fixed rest heights + staggered delays — mirrors the mockup's
   inline `height`/`animation-delay` per bar. */
const EQ_BARS = [
  { height: '30%', delay: '0s' },
  { height: '70%', delay: '.1s' },
  { height: '45%', delay: '.2s' },
  { height: '90%', delay: '.3s' },
  { height: '60%', delay: '.4s' },
  { height: '80%', delay: '.5s' },
  { height: '40%', delay: '.6s' },
  { height: '65%', delay: '.7s' },
] as const;

/** Live operational status bar — animated equalizer + swatch-dotted mono stats. */
export function PulseStrip({
  state,
  items,
  equalizer,
  right,
  className,
}: PulseStripProps) {
  const isLive = state === 'live';
  const showEq = equalizer ?? isLive;

  return (
    <div
      className={cn('lk-pstrip', isLive ? 'is-live' : 'is-idle', className)}
      role="status"
    >
      <span className="lk-pstrip__pi">
        <span className="lk-pulse" aria-hidden="true" />
        <b>{isLive ? 'LIVE' : 'IDLE'}</b> ingest
      </span>

      {showEq && (
        <span className="lk-pstrip__eq" aria-hidden="true">
          {EQ_BARS.map((bar, i) => (
            <i
              key={i}
              style={{ height: bar.height, animationDelay: bar.delay }}
            />
          ))}
        </span>
      )}

      {items.map((item, i) => (
        <span className="lk-pstrip__pi" key={i}>
          <span className="lk-pstrip__sw" style={{ background: item.swatch }} />
          {item.label} <b className="lk-mono">{item.value}</b>
        </span>
      ))}

      {right != null && <span className="lk-pstrip__right">{right}</span>}
    </div>
  );
}

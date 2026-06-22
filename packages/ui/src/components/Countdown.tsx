'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

const ALL_UNITS: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds'];

const UNIT_LABEL: Record<CountdownUnit, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Target epoch (ms). When set, the countdown ticks live every second and clears on unmount. */
  to?: number;
  /** Static parts shown when `to` is not provided (a fixed, non-ticking countdown). */
  parts?: { days?: number; hours?: number; minutes?: number; seconds?: number };
  /** Which cells to render, in order. Defaults to all four. */
  units?: CountdownUnit[];
  /** The unit cell to render glowing (the `.lit` accent cell). */
  highlightUnit?: CountdownUnit;
}

/** Break a positive remaining-millisecond span into clamped day/hour/minute/second parts. */
function splitRemaining(ms: number): Record<CountdownUnit, number> {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Two-digit zero-pad (days keep all digits when the range exceeds 99). */
function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}

/**
 * Countdown — a row of glass cells (days / hours / minutes / seconds), each a big
 * mono/display number with a unit label, counting down to a target time.
 *
 * Pass `to` (epoch ms) to tick live every second, or `parts` for a static render.
 * `highlightUnit` glows one cell with the accent gradient border. Clamps at zero.
 */
export function Countdown({ to, parts, units = ALL_UNITS, highlightUnit, className, ...rest }: CountdownProps) {
  // Compute the initial render value WITHOUT calling Date.now() at module scope.
  // When `to` is set the real value is reconciled on mount by the effect below.
  const computeParts = (): Record<CountdownUnit, number> => {
    if (to != null) return splitRemaining(to - Date.now());
    return {
      days: Math.max(0, parts?.days ?? 0),
      hours: Math.max(0, parts?.hours ?? 0),
      minutes: Math.max(0, parts?.minutes ?? 0),
      seconds: Math.max(0, parts?.seconds ?? 0),
    };
  };

  const [value, setValue] = useState<Record<CountdownUnit, number>>(computeParts);

  useEffect(() => {
    if (to == null) {
      // Static mode — reflect any prop changes, no interval.
      setValue({
        days: Math.max(0, parts?.days ?? 0),
        hours: Math.max(0, parts?.hours ?? 0),
        minutes: Math.max(0, parts?.minutes ?? 0),
        seconds: Math.max(0, parts?.seconds ?? 0),
      });
      return;
    }
    const tick = () => setValue(splitRemaining(to - Date.now()));
    tick(); // sync immediately so a stale SSR/initial value can't linger a second
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to, parts?.days, parts?.hours, parts?.minutes, parts?.seconds]);

  return (
    <div className={cn('lk-countdown', className)} role="timer" aria-live="polite" {...rest}>
      {units.map((unit) => (
        <div key={unit} className={cn('lk-countdown-cell', highlightUnit === unit && 'lk-countdown-lit')}>
          <span className="lk-countdown-num">{pad(value[unit])}</span>
          <span className="lk-countdown-label">{UNIT_LABEL[unit]}</span>
        </div>
      ))}
    </div>
  );
}

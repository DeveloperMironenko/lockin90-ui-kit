import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Button } from './Button';

export interface RestTimerProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds left (drives the arc + the centered readout). */
  remainingSec: number;
  /** Full rest duration in seconds (the 100% arc). */
  totalSec: number;
  /** Small mono caption inside the ring, above the time (default `'Rest'`). */
  label?: string;
  /** Dim line next to the ring (e.g. `'Next: Bench Press · set 3 of 5'`). */
  sublabel?: string;
  /** Trailing slot on the far right (e.g. a live HR readout). */
  trailing?: ReactNode;
  /** When given, renders the ghost `Skip` button. */
  onSkip?: () => void;
  /** Dims the arc + readout while the countdown is held. */
  paused?: boolean;
}

/* ring geometry — 116px viewBox, r 50 (the design's rest ring, scaled) */
const SIZE = 116;
const R = 50;
const C = 2 * Math.PI * R;

/** `95 → '1:35'` — minutes:seconds, mono-friendly. */
export function formatRestTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

/** Remaining fraction, clamped 0–1. */
export function restFraction(remainingSec: number, totalSec: number): number {
  if (!(totalSec > 0)) return 0;
  return Math.max(0, Math.min(1, remainingSec / totalSec));
}

/**
 * RestTimer — the between-sets countdown: a mint arc draining on a faint
 * track (the design's rest ring) with the remaining time centered in mono,
 * plus an optional sublabel ("what's next"), a ghost Skip transport, and a
 * `trailing` slot for a live readout (HR). Purely prop-driven — the caller
 * ticks `remainingSec`; the arc eases between ticks via a CSS transition
 * (disabled under `prefers-reduced-motion`).
 */
export function RestTimer({
  remainingSec,
  totalSec,
  label = 'Rest',
  sublabel,
  trailing,
  onSkip,
  paused = false,
  className,
  ...rest
}: RestTimerProps) {
  const frac = restFraction(remainingSec, totalSec);
  const time = formatRestTime(remainingSec);
  const offset = C * (1 - frac);
  const hasSide = sublabel != null || onSkip != null;

  return (
    <div
      role="timer"
      aria-label={`${label}: ${time} remaining${paused ? ', paused' : ''}`}
      className={cn('lk-resttimer', paused && 'lk-resttimer-paused', className)}
      {...rest}
    >
      <div className="lk-resttimer-ring">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle className="lk-resttimer-track" cx={SIZE / 2} cy={SIZE / 2} r={R} strokeWidth={8} />
          <circle
            className="lk-resttimer-arc"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            strokeWidth={8}
            strokeDasharray={C.toFixed(2)}
            strokeDashoffset={offset.toFixed(2)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className="lk-resttimer-center">
          <span className="lk-resttimer-label">{label}</span>
          <span className="lk-resttimer-time">{time}</span>
        </div>
      </div>
      {hasSide ? (
        <div className="lk-resttimer-main">
          {sublabel != null && <span className="lk-resttimer-sub">{sublabel}</span>}
          {onSkip ? (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip
            </Button>
          ) : null}
        </div>
      ) : null}
      {trailing != null && <div className="lk-resttimer-trailing">{trailing}</div>}
    </div>
  );
}

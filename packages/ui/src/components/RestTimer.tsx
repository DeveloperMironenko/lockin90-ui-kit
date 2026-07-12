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
  /**
   * Compact bar layout — the design's Active rest bar (`.rb`/`.rg`): a 42px
   * ring (r 18, stroke 4) with ONLY the mint time inside; `label` moves OUT
   * of the ring into a text column above `sublabel` (mono caption over bold
   * display line, e.g. "Rest" / "Next 1:05"); Skip + `trailing` sit inline on
   * the right. No card chrome — the consumer wraps it in a Card. Default
   * `false` keeps the 116px hero ring.
   */
  compact?: boolean;
}

/* ring geometry — 116px viewBox, r 50 (the design's rest ring, scaled) */
const SIZE = 116;
const R = 50;
const C = 2 * Math.PI * R;
/* compact ring geometry — the design's Active rest bar `.rg` (42px, r 18) */
const SIZE_COMPACT = 42;
const R_COMPACT = 18;

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
 * `trailing` slot for a live readout (HR). `compact` swaps the 116px hero
 * ring for the design's Active rest bar (`.rb`/`.rg`): a 42px ring holding
 * only the mint time, label + sublabel stacked beside it. Purely prop-driven
 * — the caller ticks `remainingSec`; the arc eases between ticks via a CSS
 * transition (disabled under `prefers-reduced-motion`).
 */
export function RestTimer({
  remainingSec,
  totalSec,
  label = 'Rest',
  sublabel,
  trailing,
  onSkip,
  paused = false,
  compact = false,
  className,
  ...rest
}: RestTimerProps) {
  const frac = restFraction(remainingSec, totalSec);
  const time = formatRestTime(remainingSec);
  /* same dasharray math on both scales — only the geometry changes */
  const size = compact ? SIZE_COMPACT : SIZE;
  const r = compact ? R_COMPACT : R;
  const strokeWidth = compact ? 4 : 8;
  const c = compact ? 2 * Math.PI * R_COMPACT : C;
  const offset = c * (1 - frac);
  const hasSide = sublabel != null || onSkip != null;
  const skip = onSkip ? (
    <Button variant="ghost" size="sm" onClick={onSkip}>
      Skip
    </Button>
  ) : null;

  return (
    <div
      role="timer"
      aria-label={`${label}: ${time} remaining${paused ? ', paused' : ''}`}
      className={cn('lk-resttimer', compact && 'lk-resttimer-compact', paused && 'lk-resttimer-paused', className)}
      {...rest}
    >
      <div className="lk-resttimer-ring">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <circle className="lk-resttimer-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} />
          <circle
            className="lk-resttimer-arc"
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={c.toFixed(2)}
            strokeDashoffset={offset.toFixed(2)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="lk-resttimer-center">
          {!compact && <span className="lk-resttimer-label">{label}</span>}
          <span className="lk-resttimer-time">{time}</span>
        </div>
      </div>
      {compact ? (
        <>
          {/* compact: the label moves OUT of the ring into the text column
              (design `.rb .rl` over `.rb .rt`) */}
          <div className="lk-resttimer-main">
            <span className="lk-resttimer-label">{label}</span>
            {sublabel != null && <span className="lk-resttimer-sub">{sublabel}</span>}
          </div>
          {skip}
        </>
      ) : hasSide ? (
        <div className="lk-resttimer-main">
          {sublabel != null && <span className="lk-resttimer-sub">{sublabel}</span>}
          {skip}
        </div>
      ) : null}
      {trailing != null && <div className="lk-resttimer-trailing">{trailing}</div>}
    </div>
  );
}

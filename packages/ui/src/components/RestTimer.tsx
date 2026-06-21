import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface RestTimerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow label, top-left. */
  label?: ReactNode;
  /** Target chip text, top-right (e.g. "target 2:00"). */
  target?: ReactNode;
  /** Seconds remaining in the rest period. */
  remaining?: number;
  /** Total seconds of the rest period (drives the arc + target chip). */
  total?: number;
  /** Small caption under the clock (e.g. "until set 3"). */
  subtitle?: ReactNode;
  /** Next-set name (bold part of the footer, e.g. "Set 3"). */
  nextLabel?: ReactNode;
  /** Plain detail after the bold next-set name (e.g. " · Bench Press · 5 × 80kg"). */
  nextDetail?: ReactNode;
  /** Whether the timer is paused (toggles the pause/resume control glyph + label). */
  paused?: boolean;
  /** Pause / resume tap. */
  onTogglePause?: () => void;
  /** Subtract 15s. */
  onMinus?: () => void;
  /** Add 15s. */
  onPlus?: () => void;
  /** Skip the rest period. */
  onSkip?: () => void;
}

/** mm:ss from a non-negative seconds count. */
function fmt(secs: number): string {
  const s = Math.max(0, Math.round(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

const R = 66;
const C = 2 * Math.PI * R; // 414.69

/**
 * Rest timer — between-sets countdown with a gradient SVG arc (filled = time
 * remaining), an mm:ss readout, ±15s / pause / skip controls and a next-set
 * hint. Defaults to the design example ("01:12 until set 3", target 2:00).
 */
export function RestTimer({
  label = 'Rest timer',
  target,
  remaining = 72,
  total = 120,
  subtitle = 'until set 3',
  nextLabel = 'Set 3',
  nextDetail = ' · Bench Press · 5 × 80kg',
  paused = false,
  onTogglePause,
  onMinus,
  onPlus,
  onSkip,
  className,
  ...rest
}: RestTimerProps) {
  const gradId = useId();
  const safeTotal = total > 0 ? total : 1;
  const frac = Math.max(0, Math.min(1, remaining / safeTotal));
  // Arc shows time remaining: fully drawn when remaining === total.
  const offset = C * (1 - frac);
  const targetText = target ?? `target ${fmt(safeTotal)}`;

  return (
    <section className={cn('lk-card', 'lk-rest', className)} aria-label="Rest timer between sets" {...rest}>
      <div className="lk-rest-head">
        <span className="lk-rest-l">{label}</span>
        <span className="lk-chip">{targetText}</span>
      </div>

      <div className="lk-rest-wrap">
        <svg className="lk-rest-ring" width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22D3EE" />
              <stop offset=".5" stopColor="#34F5C5" />
              <stop offset="1" stopColor="#7C5CFF" />
            </linearGradient>
          </defs>
          <circle className="lk-rest-track" cx="75" cy="75" r={R} strokeWidth="11" />
          <circle
            className="lk-rest-arc"
            cx="75"
            cy="75"
            r={R}
            strokeWidth="11"
            stroke={`url(#${gradId})`}
            strokeDasharray={C.toFixed(2)}
            strokeDashoffset={offset.toFixed(2)}
          />
        </svg>
        <div className="lk-rest-center">
          <div className="lk-rest-clock lk-mono lk-tnum">{fmt(remaining)}</div>
          {subtitle != null && <div className="lk-rest-sub">{subtitle}</div>}
        </div>
      </div>

      <div className="lk-rest-ctl">
        <button type="button" className="lk-btn lk-btn-sm" aria-label={paused ? 'Resume' : 'Pause'} onClick={onTogglePause}>
          {paused ? (
            <svg viewBox="0 0 24 24">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14M16 5v14" />
            </svg>
          )}{' '}
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" className="lk-btn lk-btn-sm" aria-label="Minus 15 seconds" onClick={onMinus}>
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14" />
          </svg>{' '}
          15s
        </button>
        <button type="button" className="lk-btn lk-btn-sm" aria-label="Plus 15 seconds" onClick={onPlus}>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>{' '}
          15s
        </button>
        <button type="button" className="lk-btn lk-btn-sm" aria-label="Skip rest" onClick={onSkip}>
          <svg viewBox="0 0 24 24">
            <path d="M5 4l10 8-10 8zM19 5v14" />
          </svg>{' '}
          Skip
        </button>
      </div>

      {nextLabel != null && (
        <div className="lk-rest-next">
          Next: <b>{nextLabel}</b>
          {nextDetail}
        </div>
      )}
    </section>
  );
}

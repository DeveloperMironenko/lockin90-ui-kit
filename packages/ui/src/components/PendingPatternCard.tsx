import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface PendingPatternChips {
  /** sample size, e.g. 24 */
  n?: number;
  /** p-value label, e.g. 'p < 0.01' */
  p?: string;
  /** confidence percent 0..100, e.g. 86 */
  confidence?: number;
}

export interface PendingPatternCardProps extends HTMLAttributes<HTMLDivElement> {
  /** headline of the detected pattern */
  title?: string;
  /** mono detail line under the title, e.g. 'pattern detected · caffeine_window' */
  detail?: string;
  /** plain-language interpretation; ReactNode so consumers can pass <b>…</b> emphasis */
  interpretation?: ReactNode;
  /** signed effect-attribution magnitude shown large, e.g. '−9' */
  effect?: string;
  /** unit suffix for the effect, e.g. 'pts' */
  effectUnit?: string;
  /** sign of the effect — drives the effect color (high/low) */
  effectSign?: 'pos' | 'neg';
  /** mono label describing what the effect is attributed to */
  effectLabel?: string;
  /** p · n · confidence stat chips */
  chips?: PendingPatternChips;
  /** Accept button label */
  acceptLabel?: string;
  /** Dismiss button label */
  dismissLabel?: string;
  /** fired when the pattern is confirmed */
  onAccept?: () => void;
  /** fired when the pattern is dismissed */
  onDismiss?: () => void;
}

/** Pending-pattern card — an AI-detected pattern awaiting confirmation: headline +
 *  interpretation, a large signed effect-attribution line, supporting stat chips
 *  (n · p · confidence), and Accept / Dismiss actions. Renders the showcase example
 *  by default. */
export function PendingPatternCard({
  title = 'Late caffeine drains your evenings',
  detail = 'pattern detected · caffeine_window',
  interpretation = (
    <>
      On days with coffee after <b>14:00</b>, your wind-down score drops and evening energy fades. Confirm if it
      matches you.
    </>
  ),
  effect = '−9',
  effectUnit = 'pts',
  effectSign = 'neg',
  effectLabel = 'evening energy / late-caffeine day',
  chips = { n: 24, p: 'p < 0.01', confidence: 86 },
  acceptLabel = 'Accept',
  dismissLabel = 'Dismiss',
  onAccept,
  onDismiss,
  className,
  ...rest
}: PendingPatternCardProps) {
  return (
    <div className={cn('lk-card', 'lk-pp', className)} {...rest}>
      <div className="lk-pp-head">
        <span className="lk-pp-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3" />
          </svg>
        </span>
        <div style={{ minWidth: 0 }}>
          <h4 className="lk-pp-ttl">{title}</h4>
          {detail && <div className="lk-pp-det lk-mono">{detail}</div>}
        </div>
      </div>
      <p className="lk-pp-interp">{interpretation}</p>
      <div className="lk-pp-effect">
        <span className={cn('lk-pp-num', 'lk-display', effectSign === 'pos' ? 'lk-pos' : 'lk-neg', 'lk-tnum')}>
          {effect}
          {effectUnit && <span className="lk-pp-unit">{effectUnit}</span>}
        </span>
        {effectLabel && <span className="lk-pp-label">{effectLabel}</span>}
      </div>
      <div className="lk-pp-stats">
        {chips?.p && (
          <Chip tone="high" dot className="lk-mono">
            <span className="lk-tnum">{chips.p}</span>
          </Chip>
        )}
        {chips?.n != null && (
          <Chip className="lk-mono">
            <span className="lk-tnum">n = {chips.n}</span>
          </Chip>
        )}
        {chips?.confidence != null && (
          <Chip tone="accent" className="lk-mono">
            <span className="lk-tnum">{chips.confidence}%</span> conf
          </Chip>
        )}
      </div>
      <div className="lk-pp-actions">
        <button type="button" className="lk-pp-btn lk-pp-accept" onClick={onAccept}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {acceptLabel}
        </button>
        <button type="button" className="lk-pp-btn lk-pp-dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}

import { cn } from '../../cn';

export interface StepDotsProps {
  /** Active step, 1-based. Steps before it read as completed; after, as track. */
  current: number;
  /** Total number of steps. */
  total: number;
  className?: string;
}

/**
 * Aurora segmented "step N of M" progress indicator — a compact row of thin
 * rounded segments. Steps `< current` are completed (accent fill), `=== current`
 * is active (accent + subtle glow, slightly wider), `> current` is an inactive
 * track. Sits above an onboarding header. Tokens-driven via `lk-*` classes.
 */
export default function StepDots({ current, total, className }: StepDotsProps) {
  const count = Math.max(0, Math.floor(total));
  return (
    <div
      className={cn('lk-stepdots', className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={Math.min(Math.max(current, 1), count)}
      aria-label={`Step ${current} of ${count}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const step = i + 1;
        const state =
          step < current ? 'lk-stepdot-done' : step === current ? 'lk-stepdot-active' : 'lk-stepdot-todo';
        return <span key={step} className={cn('lk-stepdot', state)} />;
      })}
    </div>
  );
}

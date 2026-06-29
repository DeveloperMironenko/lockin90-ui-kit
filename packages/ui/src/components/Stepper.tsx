import { forwardRef, Fragment, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/* ============================================================================
   Stepper + NumberStepper — flow-progress + quantity atoms.
   ========================================================================== */

export interface Step {
  label: string;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** ordered steps; each renders a numbered node + label */
  steps?: Step[];
  /** 0-based index of the active step */
  current?: number;
  /** when true, render the current node (and all before it) as done/checked —
   *  the whole rail reads finished (the onboarding "Complete" state) */
  complete?: boolean;
  /** visual treatment — `compact` (default) is the original 30px filled rail;
   *  `glow` matches the onboarding tracker (40px nodes, hollow mint "done",
   *  pulsing CTA "current", mint connectors). */
  variant?: 'compact' | 'glow';
  /** When provided, each step renders as a focusable `<button>` instead of a
   *  plain `<div>` — clicking (or ENTER / SPACE) fires with the 0-based index.
   *  Future steps (i > current and not `complete`) are rendered disabled to
   *  match the onboarding "no jumping ahead" UX; done + current stay live.
   *  Omit to render the original non-interactive node (backward-compatible). */
  onStepClick?: (index: number) => void;
}

const DEFAULT_STEPS: Step[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Goals' },
  { label: 'Done' },
];

/** Horizontal numbered progress rail — completed nodes filled mint with a
 *  check, the current node filled accent, future nodes faint glass; the
 *  connecting line fills accent up to the current step, faint beyond. When
 *  `complete`, the current node also reads done (mint check) so the whole
 *  rail shows finished. */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    steps = DEFAULT_STEPS,
    current = 1,
    complete = false,
    variant = 'compact',
    onStepClick,
    className,
    ...rest
  },
  ref,
) {
  const active = Math.min(Math.max(0, current), Math.max(0, steps.length - 1));
  const clickable = typeof onStepClick === 'function';

  return (
    <div
      ref={ref}
      className={cn('lk-step', variant === 'glow' && 'lk-step--glow', className)}
      {...rest}
    >
      {steps.map((step, i) => {
        const done = complete ? i <= active : i < active;
        const isCurrent = !complete && i === active;
        const state = done ? 'is-done' : isCurrent ? 'is-current' : 'is-future';
        const isFuture = !done && !isCurrent;
        const itemClass = cn(
          'lk-step-item',
          state,
          clickable && 'is-clickable',
        );
        const nodeContent = (
          <>
            <span className="lk-step-node" aria-hidden="true">
              {done ? <Icon name="check" size={14} /> : i + 1}
            </span>
            <span className="lk-step-label">{step.label}</span>
          </>
        );
        return (
          <Fragment key={`${step.label}-${i}`}>
            {i > 0 && (
              <span
                className={cn('lk-step-line', i <= active && 'is-filled')}
                aria-hidden="true"
              />
            )}
            {clickable ? (
              <button
                type="button"
                className={itemClass}
                onClick={() => onStepClick?.(i)}
                disabled={isFuture}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Go to step ${i + 1}: ${step.label}`}
              >
                {nodeContent}
              </button>
            ) : (
              <div className={itemClass}>{nodeContent}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
});

export interface NumberStepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

/** Compact quantity control — a glass pill grouping a − button, the mono
 *  centered value, and a + button; ends disable at min / max. */
export const NumberStepper = forwardRef<HTMLDivElement, NumberStepperProps>(
  function NumberStepper(
    { value = 3, min = 0, max = 99, step = 1, onChange, className, ...rest },
    ref,
  ) {
    const clamp = (v: number) => Math.min(max, Math.max(min, v));
    const current = clamp(value);
    const set = (v: number) => {
      const next = clamp(v);
      if (next !== current) onChange?.(next);
    };

    return (
      <div ref={ref} className={cn('lk-numstep', className)} {...rest}>
        <button
          type="button"
          className="lk-numstep-btn"
          onClick={() => set(current - step)}
          disabled={current <= min}
          aria-label="Decrease"
        >
          −
        </button>
        <span className="lk-numstep-value" aria-live="polite">
          {current}
        </span>
        <button
          type="button"
          className="lk-numstep-btn"
          onClick={() => set(current + step)}
          disabled={current >= max}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    );
  },
);

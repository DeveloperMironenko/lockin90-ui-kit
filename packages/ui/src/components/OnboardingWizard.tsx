import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** Step lifecycle state in the node-dot tracker. */
export type OnboardingStepState = 'done' | 'current' | 'pending';

export interface OnboardingStep {
  /** Short label under the node, e.g. "Connect". */
  label: string;
  /** Lifecycle state — controls the dot fill + the connector line. */
  state: OnboardingStepState;
}

export interface OnboardingProvider {
  /** Provider / device name, e.g. "Oura Ring 4". */
  name: string;
  /** Meta line, e.g. "Strain & recovery" or "Connected · synced 4m ago". */
  meta?: string;
  /** When true, paints the connected state (mint border + check, no button). */
  connected?: boolean;
  /** Custom logo glyph. Falls back to a generic device mark. */
  logo?: ReactNode;
}

export interface OnboardingWizardProps extends HTMLAttributes<HTMLElement> {
  /** Step tracker nodes, left → right. */
  steps?: OnboardingStep[];
  /** Zero-based index of the active step (drives the index badge + nav meta). */
  step?: number;
  /** Current step title. */
  title?: string;
  /** Current step subtitle / description. */
  sub?: string;
  /** Provider-connect grid items. */
  providers?: OnboardingProvider[];
  /** Status chip label in the head, e.g. "1 connected". Hidden when empty. */
  stepLabel?: string;
  /** Overall progress percent (0–100). Defaults to the done-ratio of steps. */
  percent?: number;
  className?: string;
}

const CHECK = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12l5 5L20 6" />
  </svg>
);

const DEFAULT_LOGO = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="var(--text-dim)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const DEFAULT_STEPS: OnboardingStep[] = [
  { label: 'Account', state: 'done' },
  { label: 'Profile', state: 'done' },
  { label: 'Connect', state: 'current' },
  { label: 'Goals', state: 'pending' },
];

const DEFAULT_PROVIDERS: OnboardingProvider[] = [
  {
    name: 'Oura Ring 4',
    meta: 'Connected · synced 4m ago',
    connected: true,
    logo: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="var(--accent-3)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.4" stroke="var(--accent-3)" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: 'WHOOP 5.0',
    meta: 'Strain & recovery',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12h3l2-6 4 12 2-9 2 3h5"
          stroke="var(--accent-2)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Apple Health',
    meta: 'Steps, sleep & HR',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20.8 7.6a5 5 0 0 0-8.8-2 5 5 0 1 0-7 7L12 20l7-7.4a5 5 0 0 0 1.8-5z"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  { name: 'Manual', meta: 'Enter readings yourself' },
];

/** Onboarding wizard — a node-dot step tracker + progress meter, the current
 *  step's index/title/sub, a provider-connect grid (Connect / connected check),
 *  and a Back + gradient Continue footer. */
export function OnboardingWizard({
  steps = DEFAULT_STEPS,
  step = 2,
  title = 'Connect your devices',
  sub = 'Pull sleep, HRV, resting HR and recovery from the ring or watch you already wear.',
  providers = DEFAULT_PROVIDERS,
  stepLabel = '1 connected',
  percent,
  className,
  ...rest
}: OnboardingWizardProps) {
  const total = Math.max(1, steps.length);
  const doneCount = steps.filter((s) => s.state === 'done').length;
  const pct = Math.round(percent ?? (doneCount / total) * 100);
  const idx = Math.max(0, Math.min(total - 1, step)) + 1;

  return (
    <article className={cn('lk-onb', 'lk-card', className)} {...rest}>
      <div className="lk-onb-topline">
        <span className="lk-onb-lbl">Your setup progress</span>
        <span className="lk-onb-pct lk-display">
          <b>{pct}%</b> complete
        </span>
      </div>

      <div className="lk-onb-steps">
        {steps.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            className={cn(
              'lk-onb-node',
              s.state === 'done' && 'lk-onb-done',
              s.state === 'current' && 'lk-onb-current',
            )}
          >
            <div className="lk-onb-conn">
              <i />
            </div>
            <div className="lk-onb-dot lk-mono" aria-current={s.state === 'current' ? 'step' : undefined}>
              {s.state === 'done' ? CHECK : i + 1}
            </div>
            <div className="lk-onb-name">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="lk-onb-meter">
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="lk-onb-rule" />

      <div className="lk-onb-head">
        <div className="lk-onb-idx lk-display" aria-hidden="true">
          {idx}
        </div>
        <div className="lk-onb-titles">
          <h3 className="lk-display">{title}</h3>
          {sub ? <p className="lk-onb-sub">{sub}</p> : null}
        </div>
        {stepLabel ? (
          <Chip tone="high" dot className="lk-onb-status">
            {stepLabel}
          </Chip>
        ) : null}
      </div>

      <div className="lk-onb-body">
        <div className="lk-onb-grid">
          {providers.map((p, i) => (
            <div key={`${p.name}-${i}`} className={cn('lk-onb-prov', p.connected && 'lk-onb-connected')}>
              <div className="lk-onb-logo">{p.logo ?? DEFAULT_LOGO}</div>
              <div className="lk-onb-pmain">
                <div className="lk-onb-pname lk-display">{p.name}</div>
                {p.meta ? <div className={cn('lk-onb-pmeta', p.connected && 'lk-onb-ok')}>{p.meta}</div> : null}
              </div>
              {p.connected ? (
                <span className="lk-onb-check">{CHECK}</span>
              ) : (
                <button className="lk-onb-cbtn" type="button">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lk-onb-nav">
        <button className="lk-onb-back" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <span className="lk-onb-navmeta lk-mono">
          Step <b>{idx}</b> of {total}
        </span>
        <button className="lk-onb-continue" type="button">
          Continue
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}

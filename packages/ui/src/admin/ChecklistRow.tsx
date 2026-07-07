import { cn } from '../cn';

/* ChecklistRow — a setup/onboarding line: a done/pending mark + label. Done shows a filled
   green check; pending shows a hollow ring. Stack inside a Panel. Web-only. `lk-check*`. */

export interface ChecklistRowProps {
  /** Item label, e.g. "Invite first user". */
  label: string;
  /** Whether the step is complete. */
  done: boolean;
  className?: string;
}

/** One setup-checklist line: status mark + label (struck/dimmed when done). */
export function ChecklistRow({ label, done, className }: ChecklistRowProps) {
  return (
    <div className={cn('lk-check', className)}>
      <span className={cn('lk-check-mark', done ? 'lk-check-mark--done' : 'lk-check-mark--pending')} aria-hidden>
        {done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className={cn('lk-check-label', done && 'lk-check-label--done')}>{label}</span>
    </div>
  );
}

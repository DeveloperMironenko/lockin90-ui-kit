import type { ReactNode } from 'react';

export interface CoachPlanItemProps {
  title: ReactNode;
  /** Sub-line under the title. */
  detail?: string;
  /** Completed state — shows a mint check; otherwise a dashed target. */
  done?: boolean;
  /** Leading icon box content (inline SVG). */
  icon?: ReactNode;
  className?: string;
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l4 4L19 7" />
    </svg>
  );
}

/**
 * A single coach-plan / to-do row: glass icon box, title + detail, and a
 * completion control (mint gradient check when done, dashed ring when pending).
 */
export default function CoachPlanItem({ title, detail, done = false, icon, className = '' }: CoachPlanItemProps) {
  return (
    <div className={`flex items-center gap-3 py-3 ${className}`.trim()}>
      {icon && (
        <span
          className="shrink-0 grid place-items-center w-9 h-9 rounded-[12px] text-secondary"
          style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
        {detail && (
          <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {detail}
          </div>
        )}
      </div>
      <span
        className="shrink-0 grid place-items-center w-6 h-6 rounded-full"
        style={
          done
            ? { background: 'var(--grad-mint)' }
            : { border: '1.5px dashed var(--border-strong)' }
        }
        aria-label={done ? 'done' : 'pending'}
      >
        {done && <Check />}
      </span>
    </div>
  );
}

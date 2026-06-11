import type { ReactNode } from 'react';

export type TimelineTone = 'ok' | 'warn' | 'bad' | 'accent';

const DOT: Record<TimelineTone, string> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
  accent: 'var(--accent)',
};

export interface TimelineItemProps {
  title: ReactNode;
  /** Right-aligned timestamp (mono). */
  time?: string;
  /** Dot color. */
  tone?: TimelineTone;
  /** Leading icon (inline SVG) before the title. */
  icon?: ReactNode;
  /** Body / description under the title. */
  children?: ReactNode;
}

/** A single connected row in a <Timeline>. */
export function TimelineItem({ title, time, tone = 'accent', icon, children }: TimelineItemProps) {
  return (
    <li className="relative pl-7 pb-5 last:pb-0">
      <span
        className="absolute left-[5px] top-3 bottom-0 w-px"
        style={{ background: 'var(--border)' }}
        aria-hidden="true"
      />
      <span
        className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full"
        style={{ background: DOT[tone], boxShadow: `0 0 8px ${DOT[tone]}` }}
        aria-hidden="true"
      />
      <div className="flex items-baseline justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white">
          {icon}
          {title}
        </span>
        {time && (
          <span className="font-mono text-[11px] shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {time}
          </span>
        )}
      </div>
      {children && (
        <div className="text-[12.5px] mt-1 leading-[1.5]" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      )}
    </li>
  );
}

export interface TimelineProps {
  children: ReactNode;
  className?: string;
}

/** Vertical event / changelog timeline. Compose with <TimelineItem>. */
export default function Timeline({ children, className = '' }: TimelineProps) {
  return <ol className={`list-none m-0 p-0 ${className}`.trim()}>{children}</ol>;
}

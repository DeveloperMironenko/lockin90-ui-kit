import { Mono } from '../../components/Typography';
import type { ApprovalTimelineEntry, ApprovalTimelineProps } from './types';

const DOT: Record<NonNullable<ApprovalTimelineEntry['tone']>, string> = {
  approved:    'bg-[#3FB661]',
  rolled_back: 'bg-accent',
  neutral:     'bg-secondary',
};

export default function ApprovalTimeline({ entries, className }: ApprovalTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className={`text-secondary text-[12px] ${className ?? ''}`}>
        No approval activity yet.
      </div>
    );
  }
  return (
    <ol className={`relative ${className ?? ''}`}>
      <div
        aria-hidden
        className="absolute left-[7px] top-1 bottom-1 w-px bg-border"
      />
      {entries.map((e) => (
        <li key={e.id} className="relative pl-7 pb-5 last:pb-0">
          <span
            className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface ${DOT[e.tone ?? 'neutral']}`}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display italic font-bold text-[11px] uppercase tracking-[0.08em] text-white">
              {e.action}
            </span>
            <span className="text-muted">·</span>
            <Mono color="white">{e.actor}</Mono>
          </div>
          <div className="mt-0.5">
            <Mono color="muted">{e.at}</Mono>
          </div>
          {e.detail && <div className="text-[12px] text-secondary mt-1">{e.detail}</div>}
        </li>
      ))}
    </ol>
  );
}

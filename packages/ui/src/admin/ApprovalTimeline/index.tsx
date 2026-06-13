import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { ApprovalTimelineEntry, ApprovalTimelineProps } from './types';

// Each tone maps the dot to an Aurora signal token (energy-zone / accent / dim).
const DOT_COLOR: Record<NonNullable<ApprovalTimelineEntry['tone']>, string> = {
  approved: 'var(--ok)',
  rolled_back: 'var(--accent)',
  neutral: 'var(--text-faint)',
};

/** Aurora vertical timeline of approval / rollback events for a version row. */
export default function ApprovalTimeline({ entries, className }: ApprovalTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className={cn('lk-timeline', 'lk-timeline-empty', className)} style={{ color: 'var(--text-faint)', fontSize: 12 }}>
        No approval activity yet.
      </div>
    );
  }

  return (
    <ol className={cn('lk-timeline', className)} style={{ position: 'relative', listStyle: 'none', margin: 0, padding: 0 }}>
      <span
        aria-hidden
        className="lk-timeline-rail"
        style={{
          position: 'absolute',
          left: 7,
          top: 4,
          bottom: 4,
          width: 1,
          background: 'linear-gradient(180deg, transparent, var(--border-2), transparent)',
        }}
      />
      {entries.map((e) => {
        const tone = e.tone ?? 'neutral';
        const color = DOT_COLOR[tone];
        const dotStyle: CSSProperties = {
          position: 'absolute',
          left: 0,
          top: 5,
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: color,
          border: '3px solid var(--bg-1)',
          boxShadow: `0 0 10px ${color}`,
        };
        return (
          <li
            key={e.id}
            className={cn('lk-timeline-item', `lk-${tone}`)}
            style={{ position: 'relative', paddingLeft: 30, paddingBottom: 20 }}
          >
            <span style={dotStyle} aria-hidden />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                className="lk-eyebrow"
                style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text)' }}
              >
                {e.action}
              </span>
              <span style={{ color: 'var(--text-faint)' }}>&middot;</span>
              <span className="lk-mono" style={{ fontSize: 12, color: 'var(--text)' }}>
                {e.actor}
              </span>
            </div>
            <div className="lk-mono" style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
              {e.at}
            </div>
            {e.detail != null && (
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{e.detail}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

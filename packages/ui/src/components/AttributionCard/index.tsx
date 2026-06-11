import type { ReactNode } from 'react';

export interface AttributionCardProps {
  /** The attribution sentence(s). Wrap drivers in <b> for emphasis. */
  children: ReactNode;
  /** Optional heading above the body. */
  title?: string;
  /** Leading icon (inline SVG). Defaults to a spark glyph. */
  icon?: ReactNode;
  className?: string;
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

/**
 * AI attribution / "why this score" summary box. Subtle accent border + glass
 * tint, an icon, and a sentence that explains the *why* behind a number — the
 * product's signature ("your afternoon dip is yesterday's late caffeine").
 */
export default function AttributionCard({ children, title, icon, className = '' }: AttributionCardProps) {
  return (
    <div
      className={`flex gap-3 ${className}`.trim()}
      style={{
        border: '1px solid rgba(124,92,255,0.22)',
        background: 'rgba(124,92,255,0.06)',
        borderRadius: 'var(--r)',
        padding: '16px 18px',
      }}
    >
      <span className="shrink-0 mt-0.5">{icon ?? <SparkIcon />}</span>
      <div>
        {title && <div className="ea-eyebrow mb-1.5">{title}</div>}
        <p className="text-[14px] leading-[1.55] m-0" style={{ color: 'var(--text-primary)' }}>
          {children}
        </p>
      </div>
    </div>
  );
}

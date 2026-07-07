import type { ReactNode } from 'react';
import { cn } from '../cn';

/* QueueTile — a pending-work row: bordered icon box, title + subtitle, and a big trailing
   count. Renders as an <a> when `href` is given (whole row is the link), else a <div>.
   Mirrors `.q-item` from lockin90-design/admin/overview.html. Web-only. `lk-qtile*` classes. */

export type QueueTileTone = 'low' | 'mid' | 'accent' | 'mint' | 'neutral';

export interface QueueTileProps {
  /** Leading icon node (usually a kit <Icon />). Tinted by `tone`. */
  icon: ReactNode;
  /** Primary label, e.g. "Refunds awaiting review". */
  title: string;
  /** Secondary caption, e.g. "2 require re-auth (> $50)". */
  subtitle?: string;
  /** Trailing count. Pass a string ("—") for unknown. Tinted by `tone`. */
  count: ReactNode;
  /** Colour tone for the icon + count. */
  tone?: QueueTileTone;
  /** Makes the whole row a link. */
  href?: string;
  className?: string;
}

const TONE_VAR: Record<QueueTileTone, string> = {
  low: 'var(--zone-low)',
  mid: 'var(--zone-mid)',
  accent: 'var(--accent-2)',
  mint: 'var(--mint)',
  neutral: 'var(--text-faint)',
};

/** Pending-queue row: icon · title/subtitle · count. Becomes a link when `href` is set. */
export function QueueTile({ icon, title, subtitle, count, tone = 'neutral', href, className }: QueueTileProps) {
  const colour = TONE_VAR[tone];
  const inner = (
    <>
      <span className="lk-qtile-ico" style={{ color: colour }}>{icon}</span>
      <span className="lk-qtile-text">
        <span className="lk-qtile-title">{title}</span>
        {subtitle != null && <span className="lk-qtile-sub">{subtitle}</span>}
      </span>
      <span className="lk-qtile-num" style={{ color: colour }}>{count}</span>
    </>
  );
  return href ? (
    <a href={href} className={cn('lk-qtile', className)}>{inner}</a>
  ) : (
    <div className={cn('lk-qtile', className)}>{inner}</div>
  );
}

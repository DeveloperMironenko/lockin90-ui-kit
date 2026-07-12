import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Button } from './Button';

export interface SessionBannerStat {
  /** Mono stat value (e.g. `'142'`). */
  value: string;
  /** Faint mono label under it (e.g. `'BPM'`). */
  label: string;
}

export interface SessionBannerAction {
  label: string;
  /** `ghost` (default) or `primary` — maps to the kit `Button` variants. */
  variant?: 'primary' | 'ghost';
  onPress?: () => void;
}

export interface SessionBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Session name (e.g. `'Push Day A'`) — truncates, never wraps. */
  title: string;
  /** Right-pinned mono status (e.g. `'Live · 24:18'`) — never wraps. */
  status?: string;
  /** Dim line under the header (e.g. `'Bench Press · set 2 of 5'`). */
  subtitle?: string;
  /** Up to 3 mono stat readouts (value + label). */
  stats?: SessionBannerStat[];
  /** Action buttons (kit `Button`, `sm`). */
  actions?: SessionBannerAction[];
  /** Pulsing red-pink live dot (magenta `#FF3D81`); also tints `status`. */
  live?: boolean;
  /** Optional leading slot (app icon / exercise glyph). */
  leading?: ReactNode;
}

/**
 * SessionBanner — the active-session live banner: a dark glass card with a
 * one-line header (optional leading slot, pulsing magenta live dot, title
 * that truncates, status that never wraps), a dim subtitle, up to 3 mono
 * stats split by hairlines, and a row of kit-Button actions. The live-dot
 * pulse is CSS-driven and disabled under `prefers-reduced-motion`.
 */
export function SessionBanner({
  title,
  status,
  subtitle,
  stats,
  actions,
  live = false,
  leading,
  className,
  ...rest
}: SessionBannerProps) {
  const shownStats = stats?.slice(0, 3) ?? [];
  return (
    <section className={cn('lk-sessionbanner', className)} {...rest}>
      <div className="lk-sessionbanner-head">
        {leading != null && <span className="lk-sessionbanner-leading">{leading}</span>}
        {live ? <span className="lk-sessionbanner-dot" aria-hidden="true" /> : null}
        <span className="lk-sessionbanner-title">{title}</span>
        {status != null && (
          <span className={cn('lk-sessionbanner-status', live && 'lk-sessionbanner-status-live')}>{status}</span>
        )}
      </div>
      {subtitle != null && <div className="lk-sessionbanner-sub">{subtitle}</div>}
      {shownStats.length > 0 && (
        <div className="lk-sessionbanner-stats">
          {shownStats.map((s, i) => (
            <div key={i} className="lk-sessionbanner-stat">
              <span className="lk-sessionbanner-statval">{s.value}</span>
              <span className="lk-sessionbanner-statlabel">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {actions && actions.length > 0 && (
        <div className="lk-sessionbanner-actions">
          {actions.map((a, i) => (
            <Button key={i} size="sm" variant={a.variant === 'primary' ? 'primary' : 'ghost'} onClick={a.onPress}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}

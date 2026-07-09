import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Padlock — body + shackle (matches LockedRow / native ProGate). */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="2.2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export interface ProGateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Lock-card heading. */
  title?: string;
  /** Lock-card supporting line. */
  subtitle?: string;
  /** Gated content, shown blurred + dimmed behind the overlay. */
  children?: ReactNode;
}

/**
 * Premium-lock overlay (web twin of native `ProGate`): renders gated `children`
 * blurred + dimmed behind a centered glass "lock" card (padlock + title +
 * subtitle), signalling "upgrade to see this". The panel-level paywall surface;
 * `LockedRow` is the row-level sibling.
 *
 * Web treatment = `filter: blur(6px)` + `opacity: 0.35` on the gated content
 * (mirrors the native `opacity 0.35` dim + optional `expo-blur` frost). The
 * whole gate is non-interactive (`pointer-events: none` on both layers) — put
 * the upgrade CTA in the surrounding host UI.
 */
export function ProGate({
  title = 'PRO Feature',
  subtitle = 'Visualize PR progression with PRO',
  children,
  className,
  ...rest
}: ProGateProps) {
  return (
    <div className={cn('lk-pro', className)} {...rest}>
      <div className={cn('lk-pro-content', children == null && 'lk-pro-content-empty')} aria-hidden="true">
        {children}
      </div>
      <div className="lk-pro-overlay" aria-hidden="true">
        <div className="lk-pro-card">
          <LockIcon className="lk-pro-lock" />
          <span className="lk-pro-title">{title}</span>
          <span className="lk-pro-sub">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

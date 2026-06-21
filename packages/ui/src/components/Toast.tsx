import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

/* ============================================================================
   Toast + Badge — two tiny status primitives sharing one stylesheet.
   ========================================================================== */

export type ToastTone = 'default' | 'success' | 'warn' | 'danger';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** tints the leading icon + the subtle left accent rail */
  tone?: ToastTone;
  /** bold first line */
  title?: string;
  /** optional dimmer second line */
  message?: ReactNode;
  /** override the default tone icon (pass any node, e.g. an <Icon />) */
  icon?: ReactNode;
  /** show a × button; called when it's clicked */
  onDismiss?: () => void;
}

const TOAST_TONE: Record<ToastTone, string> = {
  default: '',
  success: 'lk-toast-success',
  warn: 'lk-toast-warn',
  danger: 'lk-toast-danger',
};

/** Default glyph per tone — info for default/warn, check for success. */
const TONE_ICON: Record<ToastTone, IconName> = {
  default: 'info',
  success: 'check',
  warn: 'info',
  danger: 'info',
};

/** Compact floating notification card — tone-tinted icon + title/message + optional dismiss. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = 'default', title = 'Saved', message, icon, onDismiss, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="status" className={cn('lk-toast', TOAST_TONE[tone], className)} {...rest}>
      <span className="lk-toast-icon" aria-hidden="true">
        {icon ?? <Icon name={TONE_ICON[tone]} size={17} />}
      </span>
      <div className="lk-toast-body">
        <div className="lk-toast-title">{title}</div>
        {message != null && <div className="lk-toast-msg">{message}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="lk-toast-x" aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
});

export type BadgeTone = 'accent' | 'high' | 'mid' | 'low' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** count or short status text (ignored when `dot`) */
  children?: ReactNode;
  tone?: BadgeTone;
  /** render as a bare glowing dot, no text */
  dot?: boolean;
}

const BADGE_TONE: Record<BadgeTone, string> = {
  accent: 'lk-badge-accent',
  high: 'lk-badge-high',
  mid: 'lk-badge-mid',
  low: 'lk-badge-low',
  neutral: 'lk-badge-neutral',
};

/** Tiny count/status pill — smaller + simpler than Chip; or a `dot` indicator. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children = '3', tone = 'accent', dot, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('lk-badge', BADGE_TONE[tone], dot && 'lk-badge-dot', className)}
      {...rest}
    >
      {dot ? null : children}
    </span>
  );
});

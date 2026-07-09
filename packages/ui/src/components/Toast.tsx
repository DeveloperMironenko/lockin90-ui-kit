import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';
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

/**
 * Tiny count/status pill — a thin wrapper over the canonical `Chip` at its `sm`
 * size (`BadgeTone` is a subset of `ChipTone`, so it maps 1:1). Kept as its own
 * export/type for back-compat; renders identically to the retired `lk-badge`
 * (filled-gradient accent, bare glowing `dot`) via the `.lk-chip-sm` rules.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children = '3', tone = 'accent', dot, className, ...rest },
  ref,
) {
  return (
    <Chip ref={ref} size="sm" tone={tone} dot={dot} className={className} {...rest}>
      {dot ? undefined : children}
    </Chip>
  );
});

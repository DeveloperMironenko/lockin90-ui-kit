import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';
import { Icon, type IconName } from './Icon';

/* ============================================================================
   Toast + Badge — two tiny status primitives sharing one stylesheet.
   ========================================================================== */

export type ToastTone = 'default' | 'success' | 'warn' | 'danger';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** tints the edge and the icon's circle */
  tone?: ToastTone;
  /** bold first line */
  title?: string;
  /** optional dimmer second line */
  message?: ReactNode;
  /** override the default tone icon (pass any node, e.g. an <Icon />; it takes the tone's colour) */
  icon?: ReactNode;
  /** show a × button; called when it's clicked */
  onDismiss?: () => void;
  /** the × button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Dismiss' (an English fallback for older apps) */
  dismissLabel?: string;
  /** an action's label ("Undo"), in the app's language; shown with `onAction` */
  actionLabel?: string;
  /** called when the action is clicked */
  onAction?: () => void;
  /** With an action: how long (ms) until `onTimeout`, shown as a line along the bottom edge that shrinks
   *  to nothing. It holds while the toast is pressed, hovered or has focus (WCAG 2.2.1); under reduced
   *  motion it steps down once a second. */
  duration?: number;
  /** the countdown ran out: do what the action could undo */
  onTimeout?: () => void;
  /** @deprecated 2026-11-11 (owner: the solid fill "ruins the style"): ignored, every toast is the glass
   *  card. Removed in the next major. */
  filled?: boolean;
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

/** Compact floating notification: the dark glass card (solid under reduced transparency) with a
 *  tone-tinted edge and a soft shadow, the icon in a small tone-tinted circle, white text, an optional
 *  action ("Undo") with a countdown line, and ×. Fades in with a small slide (a fade under reduced motion). */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    tone = 'default',
    title = 'Saved',
    message,
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    actionLabel,
    onAction,
    duration,
    onTimeout,
    filled: _filled,
    className,
    ...rest
  },
  ref,
) {
  const action = Boolean(onAction && actionLabel);
  const counting = action && Boolean(duration);
  // a finger or a mouse button down on the toast holds the countdown (hover and focus hold it in CSS)
  const [pressed, setPressed] = useState(false);
  const press = (on: boolean) => () => setPressed(on);
  return (
    // an error interrupts (alert); every other tone is a polite status
    <div
      ref={ref}
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('lk-toast', TOAST_TONE[tone], action && 'lk-toast-has-action', pressed && 'is-held', className)}
      onPointerDown={counting ? press(true) : undefined}
      onPointerUp={counting ? press(false) : undefined}
      onPointerCancel={counting ? press(false) : undefined}
      onPointerLeave={counting ? press(false) : undefined}
      {...rest}
    >
      <span className="lk-toast-icon" aria-hidden="true">
        {icon ?? <Icon name={TONE_ICON[tone]} size={16} />}
      </span>
      <div className="lk-toast-body">
        <div className="lk-toast-title">{title}</div>
        {message != null && <div className="lk-toast-msg">{message}</div>}
      </div>
      {action && (
        <button type="button" className="lk-toast-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button type="button" className="lk-toast-x" aria-label={dismissLabel} onClick={onDismiss}>
          ×
        </button>
      )}
      {counting && (
        // the time left, from full to nothing; its end is the timeout (not announced)
        <span
          className="lk-toast-count"
          aria-hidden="true"
          data-testid="toast-countdown"
          style={{ '--lk-toast-ms': `${duration}ms`, '--lk-toast-steps': Math.max(1, Math.round(duration! / 1000)) } as CSSProperties}
          onAnimationEnd={() => onTimeout?.()}
        />
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

import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { useLiveReveal } from '../hooks/useLiveReveal';
import { Chip } from './Chip';
import { Icon, type IconName } from './Icon';

/* ============================================================================
   Toast + Badge — two tiny status primitives sharing one stylesheet.
   ========================================================================== */

export type ToastTone = 'default' | 'success' | 'info' | 'warn' | 'danger';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** what happened: `success` (a save, a completed change), `danger` (a failure), `warn`, `info`; sets the
   *  edge and the icon */
  tone?: ToastTone;
  /** the message (bold) */
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
  /** With an action: how long (ms) until `onTimeout`, shown as a seconds ring inside the action that
   *  drains to 0. It holds while the toast is hovered, pressed or has focus (WCAG 2.2.1); under reduced
   *  motion the ring steps once a second. */
  duration?: number;
  /** the countdown reached 0: do what the action could undo */
  onTimeout?: () => void;
  /** Hold the countdown from outside (as hover / focus do): the app's own way to the same action has
   *  focus, e.g. an "Undo" beside the photo while the toast's is out of reach (U9). */
  paused?: boolean;
  /** A keyboard shortcut for the action while the toast shows, in `aria-keyshortcuts` form: one or more
   *  space-separated combinations ("Control+Z Meta+Z"). Pressing it calls `onAction` (not while typing in
   *  a field); the action gets `aria-keyshortcuts`. Say it in the app's words in `message` or the action's
   *  name ("Undo (Ctrl+Z)") so a screen reader user hears it with the announcement. */
  actionKeys?: string;
  /** @deprecated 2026-11-11 (owner: the solid fill "ruins the style"): ignored, every toast is the card's
   *  surface. Removed in the next major. */
  filled?: boolean;
}

const TOAST_TONE: Record<ToastTone, string> = {
  default: '',
  success: 'lk-toast-success',
  info: 'lk-toast-info',
  warn: 'lk-toast-warn',
  danger: 'lk-toast-danger',
};

/** Default glyph per tone — check for success, info for the others. */
const TONE_ICON: Record<ToastTone, IconName> = {
  default: 'info',
  success: 'check',
  info: 'info',
  warn: 'info',
  danger: 'info',
};

/** Does a keydown match one of the `aria-keyshortcuts` combinations ("Control+Z Meta+Z")? */
export function matchesKeys(e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>, keys: string): boolean {
  return keys.split(/\s+/).filter(Boolean).some((combo) => {
    const parts = combo.split('+');
    const key = parts.pop()!.toLowerCase();
    const mods = new Set(parts.map((m) => m.toLowerCase()));
    return (
      e.key.toLowerCase() === key &&
      e.ctrlKey === mods.has('control') &&
      e.metaKey === mods.has('meta') &&
      e.altKey === mods.has('alt') &&
      e.shiftKey === mods.has('shift')
    );
  });
}

/** The seconds ring: r 8 in a 20 box, drawn 16px. */
const RING_C = 2 * Math.PI * 8;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A countdown of `total` ms that holds while `held`: the ms left (redrawn each frame, or each second
 *  under reduced motion) and `onEnd` once it reaches 0. `total` 0: nothing runs. */
function useCountdown(total: number, held: boolean, onEnd?: () => void) {
  const [left, setLeft] = useState(total);
  const remaining = useRef(total);
  const endRef = useRef(onEnd);
  const done = useRef(false);
  useEffect(() => {
    endRef.current = onEnd;
  });
  useEffect(() => {
    if (!total || held || done.current) return;
    if (remaining.current <= 0) remaining.current = total;
    const startedAt = Date.now();
    const from = remaining.current;
    const now = () => Math.max(0, from - (Date.now() - startedAt));
    const timer = setTimeout(() => {
      done.current = true;
      remaining.current = 0;
      setLeft(0);
      endRef.current?.();
    }, from);
    let frame = 0;
    let steps: ReturnType<typeof setInterval> | undefined;
    if (prefersReducedMotion()) {
      steps = setInterval(() => setLeft(now()), 250);
    } else {
      const tick = () => {
        setLeft(now());
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      if (steps) clearInterval(steps);
      if (done.current) return;
      remaining.current = now();
      setLeft(remaining.current);
    };
  }, [total, held]);
  return left;
}

/** Compact floating notification: the card's surface, opaque (`--card-solid`) with the tone's
 *  edge and a soft shadow, the tone icon in a small circle, the message in white, an optional filled
 *  action ("Undo") with a seconds ring, and ×. Fades in with a small slide (a fade under reduced motion). */
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
    paused = false,
    actionKeys,
    filled: _filled,
    className,
    ...rest
  },
  ref,
) {
  const action = Boolean(onAction && actionLabel);
  const counting = action && Boolean(duration);
  // hovered, pressed or focus anywhere inside (the action, ×, a link in the message): the countdown holds
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const left = useCountdown(counting ? duration! : 0, hovered || pressed || focused || paused, onTimeout);
  // the region is there first, its text a moment later: announced (CONVENTIONS "Accessibility")
  const pending = useLiveReveal(true);
  // the shortcut works wherever focus is, except while typing
  const actionRef = useRef(onAction);
  useEffect(() => {
    actionRef.current = onAction;
  });
  useEffect(() => {
    if (!action || !actionKeys) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!matchesKeys(e, actionKeys)) return;
      e.preventDefault();
      actionRef.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [action, actionKeys]);
  const seconds = Math.ceil(left / 1000);
  // smooth, or whole seconds under reduced motion
  const fraction = counting ? (prefersReducedMotion() ? (seconds * 1000) / duration! : left / duration!) : 0;
  const on = (set: (v: boolean) => void, v: boolean) => (counting ? () => set(v) : undefined);
  return (
    // an error interrupts (alert); every other tone is a polite status
    <div
      ref={ref}
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('lk-toast', TOAST_TONE[tone], action && 'lk-toast-has-action', className)}
      onMouseEnter={on(setHovered, true)}
      onMouseLeave={on(setHovered, false)}
      onPointerDown={on(setPressed, true)}
      onPointerUp={on(setPressed, false)}
      onPointerCancel={on(setPressed, false)}
      onFocus={on(setFocused, true)}
      // focus moving between the toast's own controls keeps the hold
      onBlur={
        counting
          ? (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }
          : undefined
      }
      {...rest}
    >
      <span className="lk-toast-icon" aria-hidden="true">
        {icon ?? <Icon name={TONE_ICON[tone]} size={13} />}
      </span>
      <div className="lk-toast-body" style={pending ? { visibility: 'hidden' } : undefined}>
        <div className="lk-toast-title">{title}</div>
        {message != null && <div className="lk-toast-msg">{message}</div>}
      </div>
      {action && (
        <button type="button" className="lk-toast-action" onClick={onAction} aria-keyshortcuts={actionKeys || undefined}>
          {counting && (
            // the seconds left: a ring draining to 0 and the number (hidden from screen readers, which
            // hear only the action's name)
            <span className="lk-toast-ring" aria-hidden="true" data-testid="toast-countdown">
              <svg viewBox="0 0 20 20">
                <circle className="lk-toast-ring-track" cx="10" cy="10" r="8" />
                <circle
                  className="lk-toast-ring-left"
                  cx="10"
                  cy="10"
                  r="8"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - fraction)}
                />
              </svg>
              <i>{seconds}</i>
            </span>
          )}
          <span>{actionLabel}</span>
        </button>
      )}
      {onDismiss && (
        <button type="button" className="lk-toast-x" aria-label={dismissLabel} onClick={onDismiss}>
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

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';

export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the sheet. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim click or ESC. */
  onClose?: () => void;
  /** Edge the panel slides in from. Bottom = full-width bottom sheet with a
   *  drag handle; right/left = full-height side drawer. */
  side?: 'bottom' | 'right' | 'left';
  /** Optional header title (font-display). */
  title?: string;
  /** Body content. */
  children?: ReactNode;
}

/** Fraction of the sheet height the user must drag past to dismiss. */
const DISMISS_FRACTION = 0.25;
/** Downward fling velocity (px/ms) that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;

/** Pure release decision for the bottom-sheet drag: dismiss when the pull went
 *  past DISMISS_FRACTION of the sheet height, or when the release was a
 *  downward fling faster than DISMISS_VELOCITY (px/ms) — an upward or zero
 *  pull never dismisses. Module export for unit tests (not part of the kit's
 *  public index); extracted from the inline predicate, behavior identical. */
export function shouldDismissSheet(dy: number, height: number, vy: number): boolean {
  return dy > height * DISMISS_FRACTION || (dy > 0 && vy > DISMISS_VELOCITY);
}

/** Side drawer + bottom sheet over a blurred scrim. The bottom variant is
 *  anchored to the bottom edge with rounded top corners and a centered drag
 *  handle; right/left variants are full-height edge panels. Slides in via a
 *  transform on the `is-open` class. Closes on scrim click + ESC; the panel
 *  stops propagation. The bottom variant's header strip (handle + title) is
 *  draggable: pull down past ~25% of the sheet height (or fling) to dismiss,
 *  otherwise it snaps back (jump-cut under prefers-reduced-motion). */
export function Sheet({
  open = true,
  onClose,
  side = 'bottom',
  title,
  children,
  className,
  ...rest
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; lastY: number; lastT: number; vel: number } | null>(null);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const onGrabPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, lastY: e.clientY, lastT: e.timeStamp, vel: 0 };
    panelRef.current.style.transition = 'none';
  };

  const onGrabPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || !panel) return;
    const dt = e.timeStamp - drag.lastT;
    if (dt > 0) drag.vel = (e.clientY - drag.lastY) / dt;
    drag.lastY = e.clientY;
    drag.lastT = e.timeStamp;
    const dy = Math.max(0, e.clientY - drag.startY);
    panel.style.transform = `translateY(${dy}px)`;
  };

  const settleBack = (panel: HTMLDivElement) => {
    if (prefersReducedMotion()) {
      // Jump back into place with transitions still disabled, then re-enable.
      panel.style.transform = '';
      void panel.offsetHeight; // commit the jump before restoring transitions
      panel.style.transition = '';
    } else {
      panel.style.transition = ''; // restore the stylesheet transition
      void panel.offsetHeight; // ensure the transition sees the dragged position
      panel.style.transform = ''; // animate back to the `.is-open` transform
    }
  };

  const onGrabPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    dragRef.current = null;
    if (!drag || !panel) return;
    const dy = Math.max(0, e.clientY - drag.startY);
    const height = panel.offsetHeight || 1;
    const shouldDismiss =
      e.type !== 'pointercancel' && !!onClose && shouldDismissSheet(dy, height, drag.vel);

    if (!shouldDismiss) {
      settleBack(panel);
      return;
    }

    if (prefersReducedMotion()) {
      panel.style.transition = '';
      panel.style.transform = '';
      onClose?.();
      return;
    }

    // Animate the rest of the way out, then close.
    panel.style.transition = '';
    void panel.offsetHeight;
    panel.style.transform = 'translateY(100%)';
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      panel.style.transform = '';
      onClose?.();
    };
    panel.addEventListener('transitionend', finish, { once: true });
    window.setTimeout(finish, 420); // fallback in case transitionend never fires
  };

  if (!open) return null;

  return (
    <div
      className="lk-sheet-scrim is-open"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        ref={panelRef}
        className={cn(
          'lk-sheet',
          side === 'bottom' && 'lk-sheet-bottom',
          side === 'right' && 'lk-sheet-right',
          side === 'left' && 'lk-sheet-left',
          'is-open',
          className,
        )}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {side === 'bottom' ? (
          <div
            className="lk-sheet-grab"
            onPointerDown={onGrabPointerDown}
            onPointerMove={onGrabPointerMove}
            onPointerUp={onGrabPointerEnd}
            onPointerCancel={onGrabPointerEnd}
          >
            <span className="lk-sheet-handle" aria-hidden="true" />
            {title && <h2 className="lk-sheet-title">{title}</h2>}
          </div>
        ) : (
          title && <h2 className="lk-sheet-title">{title}</h2>
        )}
        <div className="lk-sheet-body">{children}</div>
      </div>
    </div>
  );
}

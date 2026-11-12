import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { useDialogFocus } from '../hooks/useDialogFocus';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the modal. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim click, close-button click, or ESC. */
  onClose?: () => void;
  /** Header title (font-display). Header is omitted when absent. */
  title?: string;
  /** Body content. */
  children?: ReactNode;
  /** Optional footer — the actions under a hairline (CONVENTIONS "Dialog actions"): "Cancel | Primary",
   *  each half the width at phone width (≤ 540px), end-aligned on a wider screen. */
  footer?: ReactNode;
  /** Card max-width: sm ~380px, md ~460px, lg ~620px. */
  size?: 'sm' | 'md' | 'lg';
  /** The close button's spoken name, translated (as native). @default 'Close' */
  closeLabel?: string;
}

const CLOSE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

/** Centered dialog over a blurred scrim. Closes on scrim click + ESC. Takes focus when it opens, keeps
 *  Tab inside, gives focus back on close, and is named by its title (Modal.md §7). */
export function Modal({
  open = true,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close',
  className,
  ...rest
}: ModalProps) {
  // Only portal after mount so document.body exists (avoids SSR access to
  // `document` + hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(open && mounted, panelRef);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Portal to <body> so the fixed scrim escapes any ancestor that creates a
  // containing block (transform / backdrop-filter on the glass panels) —
  // otherwise the dialog is clipped/hidden inside the page instead of
  // overlaying the viewport.
  return createPortal(
    <div
      className="lk-modal-scrim"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        className={cn(
          'lk-modal',
          size === 'sm' && 'lk-modal-sm',
          size === 'lg' && 'lk-modal-lg',
          className,
        )}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {(title || onClose) && (
          <div className="lk-modal-head">
            {title && (
              <h2 id={titleId} className="lk-modal-title">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                type="button"
                className="lk-modal-close"
                aria-label={closeLabel}
                onClick={() => onClose()}
              >
                {CLOSE}
              </button>
            )}
          </div>
        )}
        <div className="lk-modal-body">{children}</div>
        {footer && <div className="lk-modal-foot lk-dialog-actions">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

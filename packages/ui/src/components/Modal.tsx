import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the modal. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim click, close-button click, or ESC. */
  onClose?: () => void;
  /** Header title (font-display). Header is omitted when absent. */
  title?: string;
  /** Body content. */
  children?: ReactNode;
  /** Optional footer — right-aligned actions under a hairline. */
  footer?: ReactNode;
  /** Card max-width: sm ~380px, md ~460px, lg ~620px. */
  size?: 'sm' | 'md' | 'lg';
}

const CLOSE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

/** Centered dialog over a blurred scrim. Closes on scrim click + ESC. */
export function Modal({
  open = true,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
  ...rest
}: ModalProps) {
  // Only portal after mount so document.body exists (avoids SSR access to
  // `document` + hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {(title || onClose) && (
          <div className="lk-modal-head">
            {title && <h2 className="lk-modal-title">{title}</h2>}
            {onClose && (
              <button
                type="button"
                className="lk-modal-close"
                aria-label="Close"
                onClick={() => onClose()}
              >
                {CLOSE}
              </button>
            )}
          </div>
        )}
        <div className="lk-modal-body">{children}</div>
        {footer && <div className="lk-modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

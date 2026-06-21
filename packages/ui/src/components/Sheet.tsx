import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
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

/** Side drawer + bottom sheet over a blurred scrim. The bottom variant is
 *  anchored to the bottom edge with rounded top corners and a centered drag
 *  handle; right/left variants are full-height edge panels. Slides in via a
 *  transform on the `is-open` class. Closes on scrim click + ESC; the panel
 *  stops propagation. */
export function Sheet({
  open = true,
  onClose,
  side = 'bottom',
  title,
  children,
  className,
  ...rest
}: SheetProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lk-sheet-scrim is-open"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
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
        {side === 'bottom' && (
          <span className="lk-sheet-handle" aria-hidden="true" />
        )}
        {title && <h2 className="lk-sheet-title">{title}</h2>}
        <div className="lk-sheet-body">{children}</div>
      </div>
    </div>
  );
}

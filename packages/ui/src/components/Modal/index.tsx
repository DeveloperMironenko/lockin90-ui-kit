'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import Button from '../Button';
import { cn } from '../../cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Small mono/uppercase label above the title (back-compat — admin app). */
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Muted line under the title (back-compat — admin app). */
  subtitle?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** Footer content (usually buttons). */
  footer?: ReactNode;
  /**
   * Max width of the panel. A number is treated as px (default 440); a string
   * (e.g. `"720px"`) is applied as-is.
   */
  width?: string | number;
  /** alertdialog semantics for destructive confirmations. */
  danger?: boolean;
  className?: string;
}

/** Centered glass dialog over a blurred scrim. Closes on Escape / scrim click. */
export default function Modal({ open, onClose, eyebrow, title, subtitle, icon, children, footer, width = 440, danger, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background: 'rgba(3,4,8,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        role={danger ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn('lk-card', 'lk-lit', className)}
        style={{ width: '100%', maxWidth: typeof width === 'number' ? `${width}px` : width, boxShadow: 'var(--elev-2)' }}
      >
        {icon && <div style={{ marginBottom: 12 }}>{icon}</div>}
        {eyebrow && <div className="lk-eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        {title && (
          <h3 className="lk-display" style={{ fontSize: 18, marginBottom: subtitle ? 4 : children ? 8 : 0 }}>
            {title}
          </h3>
        )}
        {subtitle && (
          <div className="lk-muted" style={{ fontSize: 13, marginBottom: children ? 8 : 0 }}>
            {subtitle}
          </div>
        )}
        {children && (
          <div className="lk-muted" style={{ fontSize: 14, lineHeight: 1.55 }}>
            {children}
          </div>
        )}
        {footer && <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as destructive (default true). */
  danger?: boolean;
}

/** A Modal preset with Cancel / Confirm actions. */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      danger={danger}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" magnetic onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

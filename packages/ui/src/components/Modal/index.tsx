'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import Button from '../Button';
import { cn } from '../../cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** Footer content (usually buttons). */
  footer?: ReactNode;
  /** Max width of the panel in px (default 440). */
  width?: number;
  /** alertdialog semantics for destructive confirmations. */
  danger?: boolean;
  className?: string;
}

/** Centered glass dialog over a blurred scrim. Closes on Escape / scrim click. */
export default function Modal({ open, onClose, title, icon, children, footer, width = 440, danger, className }: ModalProps) {
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
        style={{ width: '100%', maxWidth: width, boxShadow: 'var(--elev-2)' }}
      >
        {icon && <div style={{ marginBottom: 12 }}>{icon}</div>}
        {title && (
          <h3 className="lk-display" style={{ fontSize: 18, marginBottom: children ? 8 : 0 }}>
            {title}
          </h3>
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

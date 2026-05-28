'use client';

import { useEffect } from 'react';
import { Eyebrow } from '../Typography';
import type { ModalProps } from './types';

export default function Modal({ open, onClose, title, eyebrow, children, footer, width = '520px' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-6 ea-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-surface border border-border-strong rounded-md p-6"
        style={{ maxWidth: width }}
      >
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && <h2 className="ea-display text-[28px] mt-2 mb-4">{title}</h2>}
        {children}
        {footer && <div className="mt-6 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}

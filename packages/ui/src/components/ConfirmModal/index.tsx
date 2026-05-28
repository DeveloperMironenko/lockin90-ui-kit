'use client';

import { useEffect } from 'react';
import { Button } from '../Button';
import type { ConfirmModalProps } from './types';

export default function ConfirmModal({
  open,
  title,
  consequence,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  reauthRequired = false,
  reauthNote,
  onConfirm,
  onCancel,
  loading = false,
  confirmDisabled = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ea-fade-in">
      <div className="bg-elevated border border-border-strong rounded w-[480px] max-w-[90vw] overflow-hidden">
        <div className="px-6 pt-6 pb-3 border-b border-border">
          <div className={`ea-eyebrow mb-1 ${destructive ? 'text-accent' : 'text-secondary'}`}>
            {destructive ? 'DESTRUCTIVE ACTION' : 'CONFIRM'}
          </div>
          <h2 className="ea-display text-[22px] text-white">{title}</h2>
        </div>
        <div className="px-6 py-5 text-[13px] text-secondary leading-relaxed">
          {consequence}
          {reauthRequired && (
            <div className="mt-4 px-3 py-2 border border-accent/30 bg-accent/5 rounded font-mono text-[11px] text-accent">
              {reauthNote ?? 'Re-auth required. You will be prompted for your password.'}
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'secondary' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            disabled={confirmDisabled}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

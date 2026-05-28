'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Mono } from '../../components/Typography';
import type { TypedConfirmModalProps } from './types';

/**
 * Confirmation modal that requires the operator to type a specific phrase
 * (the version id, target user count, or a literal like
 * `I-CONFIRM-BULK-RECOMPUTE-ALL`) before the confirm button activates.
 *
 * Used for the highest-stakes admin actions: version rollback, bulk recompute,
 * full pipeline rollout.
 */
export default function TypedConfirmModal({
  open,
  title,
  consequence,
  expected,
  promptLabel = 'Type the value below to confirm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: TypedConfirmModalProps) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!open) {
      setTyped('');
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const matched = typed === expected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ea-fade-in">
      <div className="bg-elevated border border-border-strong rounded w-[520px] max-w-[90vw] overflow-hidden">
        <div className="px-6 pt-6 pb-3 border-b border-border">
          <div className={`ea-eyebrow mb-1 ${destructive ? 'text-accent' : 'text-secondary'}`}>
            {destructive ? 'DESTRUCTIVE ACTION' : 'CONFIRM'}
          </div>
          <h2 className="ea-display text-[22px] text-white">{title}</h2>
        </div>
        <div className="px-6 py-5 text-[13px] text-secondary leading-relaxed">
          {consequence}
          <div className="mt-4">
            <div className="ea-input-label mb-1.5">
              {promptLabel} — <Mono color="white">{expected}</Mono>
            </div>
            <input
              autoFocus
              type="text"
              className="ea-input font-mono"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={expected}
              aria-label="Confirmation phrase"
            />
            {typed.length > 0 && !matched && (
              <div className="mt-1 font-mono text-[10px] text-accent">
                Does not match. Type the exact phrase shown above.
              </div>
            )}
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'secondary' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            disabled={!matched || loading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

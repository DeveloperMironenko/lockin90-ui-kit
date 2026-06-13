'use client';

import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { TypedConfirmModalProps } from './types';

/**
 * Confirmation modal that requires the operator to type a specific phrase
 * (the version id, target user count, or a literal like
 * `I-CONFIRM-BULK-RECOMPUTE-ALL`) before the confirm button activates.
 *
 * Used for the highest-stakes admin actions: version rollback, bulk recompute,
 * full pipeline rollout. Composed from the Aurora base Modal + Input + Button —
 * `destructive` flips the Modal to alertdialog semantics and the confirm button
 * to the warm/danger gradient.
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
    if (!open) setTyped('');
  }, [open]);

  const matched = typed === expected;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      danger={destructive}
      width={520}
      title={
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            className="lk-eyebrow"
            style={{ color: destructive ? 'var(--bad)' : 'var(--accent-2)' }}
          >
            {destructive ? 'Destructive action' : 'Confirm'}
          </span>
          <span>{title}</span>
        </span>
      }
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onCancel} style={{ flex: 1 }}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            size="sm"
            magnetic
            loading={loading}
            disabled={!matched || loading}
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>{consequence}</div>
        <div className="lk-form-row">
          <label className="lk-form-label" htmlFor="typed-confirm-input">
            {promptLabel} —{' '}
            <span className="lk-mono" style={{ color: 'var(--text)', textTransform: 'none' }}>
              {expected}
            </span>
          </label>
          <Input
            id="typed-confirm-input"
            autoFocus
            type="text"
            className="lk-mono"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={expected}
            aria-label="Confirmation phrase"
            invalid={typed.length > 0 && !matched}
          />
          {typed.length > 0 && !matched && (
            <span className="lk-form-hint lk-error">
              Does not match. Type the exact phrase shown above.
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}

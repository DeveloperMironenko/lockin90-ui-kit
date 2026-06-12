'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import PasswordInput from '../PasswordInput';
import FormRow from '../FormRow';

export interface ReauthDialogProps {
  open: boolean;
  /** Resolve = correct password (proceed). Throw an Error = wrong password / failure; its `.message` is shown. */
  verify: (password: string) => Promise<void>;
  /** Called after `verify()` resolves. */
  onConfirmed: () => void;
  /** Cancel / close. */
  onCancel: () => void;
  /** Dialog heading (default "Confirm your password"). */
  title?: string;
  /** Body copy (default explains sensitive-action re-auth, valid 5 minutes). */
  description?: string;
  /** External loading (e.g. a parent action is pending) — disables the form. */
  loading?: boolean;
}

const DEFAULT_TITLE = 'Confirm your password';
const DEFAULT_DESCRIPTION =
  'For your security, re-enter your password to continue with this sensitive action. This confirmation stays valid for 5 minutes.';

/**
 * Aurora re-authentication prompt — gates a sensitive action (e.g. account
 * deletion) behind a password re-entry. Composes the kit's Modal + FormRow +
 * PasswordInput + Button; it is transport-agnostic, so ALL network goes through
 * the injected `verify` (no fetch/URL inside). The native counterpart
 * `@lockin90/ui-native` ReauthSheet shares this exact prop API.
 */
export default function ReauthDialog({
  open,
  verify,
  onConfirmed,
  onCancel,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  loading = false,
}: ReauthDialogProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset local state whenever the dialog (re)opens.
  useEffect(() => {
    if (open) {
      setPassword('');
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const busy = submitting || loading;
  const canSubmit = password.length > 0 && !busy;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await verify(password);
      onConfirmed();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Incorrect password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      danger
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            magnetic
            type="submit"
            form="lk-reauth-form"
            loading={submitting}
            disabled={!canSubmit}
          >
            Confirm
          </Button>
        </>
      }
    >
      {description}
      <form id="lk-reauth-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <FormRow label="Password" htmlFor="lk-reauth-password" error={error ?? undefined}>
          <PasswordInput
            id="lk-reauth-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            invalid={Boolean(error)}
            disabled={busy}
            autoComplete="current-password"
            autoFocus
            aria-label="Password"
          />
        </FormRow>
      </form>
    </Modal>
  );
}

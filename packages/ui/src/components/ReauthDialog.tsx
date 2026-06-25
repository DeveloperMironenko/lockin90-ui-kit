'use client';

import { useEffect, useState } from 'react';
import { cn } from '../cn';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Alert } from './Alert';

export interface ReauthDialogProps {
  /** Show the dialog. When false, nothing renders. */
  open: boolean;
  /** Called on scrim click, ESC, close-button, or Cancel. */
  onClose: () => void;
  /** Password re-auth path — receives the field value on Confirm. */
  onSubmitPassword?: (password: string) => void;
  /** Google re-auth path — invoked by the "Continue with Google" button. */
  onGoogle?: () => void;
  /** Header title. */
  title?: string;
  /** Short reassurance line under the title. */
  description?: string;
  /** Show the password field + Confirm button (default true). */
  hasPassword?: boolean;
  /** Show the "Continue with Google" button (default false). */
  hasGoogle?: boolean;
  /** Disable inputs + show loading on submit. */
  loading?: boolean;
  /** Error message rendered in a danger Alert above the fields. */
  error?: string;
}

/** Google "G" mark — matches the auth design's SSO glyph. */
const GOOGLE = (
  <svg viewBox="0 0 24 24" aria-hidden="true" width={18} height={18}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

/**
 * Step-up re-authentication dialog — "confirm it's you" before a sensitive
 * action. A centered Modal with an optional password path + optional Google
 * path; local password state is kept internal and cleared on close.
 */
export function ReauthDialog({
  open,
  onClose,
  onSubmitPassword,
  onGoogle,
  title = "Confirm it's you",
  description = 'For your security, re-enter your password to continue.',
  hasPassword = true,
  hasGoogle = false,
  loading = false,
  error,
}: ReauthDialogProps) {
  const [password, setPassword] = useState('');

  // Drop the field whenever the dialog closes so it never leaks across opens.
  useEffect(() => {
    if (!open) setPassword('');
  }, [open]);

  const close = () => {
    setPassword('');
    onClose();
  };

  const submit = () => {
    if (loading || !password) return;
    onSubmitPassword?.(password);
  };

  return (
    <Modal open={open} onClose={close} title={title} size="sm">
      <div className="lk-reauth">
        {description ? <p className="lk-reauth-desc">{description}</p> : null}

        {error ? (
          <Alert tone="danger" className="lk-reauth-error">
            {error}
          </Alert>
        ) : null}

        {hasPassword ? (
          <form
            className="lk-reauth-pw"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              disabled={loading}
              invalid={Boolean(error)}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              className="lk-reauth-submit"
              disabled={loading || !password}
            >
              {loading ? 'Confirming…' : 'Confirm'}
            </Button>
          </form>
        ) : null}

        {hasPassword && hasGoogle ? (
          <div className="lk-reauth-or" aria-hidden="true">
            <span className="lk-reauth-ln" />
            <span>or</span>
            <span className="lk-reauth-ln" />
          </div>
        ) : null}

        {hasGoogle ? (
          <Button
            variant="default"
            className={cn('lk-reauth-google')}
            disabled={loading}
            onClick={() => onGoogle?.()}
          >
            <span className="lk-reauth-google-icon">{GOOGLE}</span>
            Continue with Google
          </Button>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          className="lk-reauth-cancel"
          onClick={close}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { cn } from '../cn';
import { FormField } from './FormField';
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
  /** Apple re-auth path — invoked by the "Continue with Apple" button (as native). */
  onApple?: () => void;
  /** Header title. */
  title?: string;
  /** Short reassurance line under the title. */
  description?: string;
  /** Show the password field + Confirm button (default true). */
  hasPassword?: boolean;
  /** Show the "Continue with Google" button (default false). */
  hasGoogle?: boolean;
  /** Show the "Continue with Apple" button (default false); with `hasGoogle` both show, Google first. */
  hasApple?: boolean;
  /** Disable inputs + show loading on submit. */
  loading?: boolean;
  /** Error message rendered in a danger Alert above the fields. */
  error?: string;
  /** Localizable labels — English defaults; pass translated strings to localize (as native). */
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  googleLabel?: string;
  appleLabel?: string;
  orLabel?: string;
  /** the close button's spoken name */
  closeLabel?: string;
  /** the field's error when Confirm is pressed with no password (Confirm stays enabled and says what's
   *  missing, CONVENTIONS "Accessibility"). @default 'Enter your password' */
  passwordRequiredLabel?: string;
}

/** Google "G" mark — matches the auth design's SSO glyph. */
/** Apple's mark, in the label colour (the brand's own monochrome glyph, as SsoButton's). */
const APPLE = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={18} height={18}>
    <path d="M16.37 12.78c.02 2.5 2.19 3.33 2.21 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.1-2.63-2.11-1.43-2.07-2.53-5.86-1.06-8.42a4.1 4.1 0 0 1 3.46-2.1c1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.2-.77.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.07-1.8 3.21M14.3 4.6c.58-.71.98-1.69.87-2.68-.84.04-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.48 2.49-1.16" />
  </svg>
);

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
  onApple,
  title = "Confirm it's you",
  description = 'For your security, re-enter your password to continue.',
  hasPassword = true,
  hasGoogle = false,
  hasApple = false,
  loading = false,
  error,
  passwordLabel = 'Password',
  passwordPlaceholder = 'Your password',
  confirmLabel = 'Confirm',
  confirmingLabel = 'Confirming…',
  cancelLabel = 'Cancel',
  googleLabel = 'Continue with Google',
  appleLabel = 'Continue with Apple',
  orLabel = 'or',
  closeLabel = 'Close',
  passwordRequiredLabel = 'Enter your password',
}: ReauthDialogProps) {
  const [password, setPassword] = useState('');
  // Confirm pressed with no password: the field says so (Confirm is never disabled for it)
  const [missing, setMissing] = useState(false);

  // Drop the field whenever the dialog closes so it never leaks across opens.
  useEffect(() => {
    if (!open) {
      setPassword('');
      setMissing(false);
    }
  }, [open]);

  const close = () => {
    setPassword('');
    setMissing(false);
    onClose();
  };

  const submit = () => {
    if (loading) return;
    if (!password) {
      setMissing(true);
      return;
    }
    onSubmitPassword?.(password);
  };

  return (
    <Modal open={open} onClose={close} title={title} size="sm" closeLabel={closeLabel}>
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
            {/* the dialog opens on the field (the Modal keeps Tab inside and gives focus back on close) */}
            <FormField label={passwordLabel} error={missing && !password ? passwordRequiredLabel : undefined}>
              <Input
                type="password"
                autoComplete="current-password"
                autoFocus
                placeholder={passwordPlaceholder}
                value={password}
                disabled={loading}
                invalid={Boolean(error) || (missing && !password)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>
            <Button
              type="submit"
              variant="primary"
              className="lk-reauth-submit"
              loading={loading}
              aria-label={loading ? confirmingLabel : undefined}
            >
              {confirmLabel}
            </Button>
          </form>
        ) : null}

        {hasPassword && (hasGoogle || hasApple) ? (
          <div className="lk-reauth-or" aria-hidden="true">
            <span className="lk-reauth-ln" />
            <span>{orLabel}</span>
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
            {googleLabel}
          </Button>
        ) : null}

        {hasApple ? (
          <Button
            variant="default"
            className="lk-reauth-google lk-reauth-apple"
            disabled={loading}
            onClick={() => onApple?.()}
          >
            <span className="lk-reauth-google-icon">{APPLE}</span>
            {appleLabel}
          </Button>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          className="lk-reauth-cancel"
          onClick={close}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}

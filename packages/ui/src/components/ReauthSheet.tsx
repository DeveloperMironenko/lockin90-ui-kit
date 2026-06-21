import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** The protected action being gated by the step-up reauth. */
export interface ReauthAction {
  /** Uppercase label above the action line, e.g. "Protected action". */
  label: string;
  /** Action description, e.g. "Change email →". Rendered before {@link target}. */
  value: ReactNode;
  /** Optional emphasized target (the new value), shown bold + cyan. */
  target?: ReactNode;
}

export interface ReauthSheetProps extends HTMLAttributes<HTMLElement> {
  /** Sheet title. */
  title?: string;
  /** Supporting line under the title. */
  subtitle?: string;
  /** The sensitive action this reauth gates. */
  action?: ReauthAction;
  /** Step-up chip text, e.g. "step-up · expires in 5 min". */
  expiresLabel?: string;
  /** Face ID button caption. */
  scanLabel?: string;
  /** Password-fallback link text. */
  passwordLabel?: string;
  /** Cancel button text. */
  cancelLabel?: string;
  /** Face ID button handler. */
  onScan?: () => void;
  /** Password-fallback handler. */
  onUsePassword?: () => void;
  /** Cancel handler. */
  onCancel?: () => void;
  className?: string;
}

const LOCK = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const MAIL = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const FACE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10h.01M15 10h.01M12 9v3.5l-1.2 1M9.5 15c.8.7 1.7 1 2.5 1s1.7-.3 2.5-1" />
  </svg>
);

const DEFAULT_ACTION: ReauthAction = {
  label: 'Protected action',
  value: 'Change email → ',
  target: 'm.kane@new.com',
};

/** Reauth / step-up sheet — a security confirmation surface: a lock badge +
 *  expiry chip, a "Confirm it's you" title + subtitle, a framed protected-action
 *  row, a Face ID button with an animated scan ring, a password fallback, and a
 *  Cancel button. */
export function ReauthSheet({
  title = "Confirm it's you",
  subtitle = 'Required to change your email',
  action = DEFAULT_ACTION,
  expiresLabel = 'step-up · expires in 5 min',
  scanLabel = 'Scan to confirm',
  passwordLabel = 'Use password instead',
  cancelLabel = 'Cancel',
  onScan,
  onUsePassword,
  onCancel,
  className,
  ...rest
}: ReauthSheetProps) {
  return (
    <section className={cn('lk-reauth', className)} role="dialog" aria-label={title} {...rest}>
      <div className="lk-reauth-top">
        <span className="lk-reauth-lock">{LOCK}</span>
        {expiresLabel ? (
          <Chip tone="accent" dot className="lk-reauth-exp">
            {expiresLabel}
          </Chip>
        ) : null}
      </div>

      <div className="lk-reauth-head">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      {action ? (
        <div className="lk-reauth-action">
          {MAIL}
          <span className="lk-reauth-act-txt">
            <span className="lk-reauth-act-label">{action.label}</span>
            <span className="lk-mono">
              {action.value}
              {action.target ? <b>{action.target}</b> : null}
            </span>
          </span>
        </div>
      ) : null}

      <button className="lk-reauth-face" type="button" onClick={onScan}>
        <span className="lk-reauth-ring">{FACE}</span>
        <span className="lk-reauth-scan">{scanLabel}</span>
      </button>

      {passwordLabel ? (
        <button className="lk-reauth-pass" type="button" onClick={onUsePassword}>
          {passwordLabel}
        </button>
      ) : null}

      <button className="lk-reauth-cancel" type="button" onClick={onCancel}>
        {cancelLabel}
      </button>
    </section>
  );
}

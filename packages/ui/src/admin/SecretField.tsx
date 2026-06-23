'use client';

import { useState, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from '../components/Icon';
import { CopyButton } from '../components/Popover';

/* SecretField — read-only masked secret display for the operator console
   (webhook signing keys, TOTP secrets, API tokens). A mono inset field showing
   a non-secret `prefix` + a masked middle (••••) + a non-secret `tail`, with an
   eye toggle that reveals the full secret (firing `onReveal` exactly once for
   the audit hook) and an optional copy button. Read-only — NOT an editable
   input (distinct from PasswordInput). Web-only (admin has no native surface).
   Matches the `.key-mask` field from lockin90-design/admin/wearables.html. */

export interface SecretFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** Masked display string used when the field is masked
   *  (e.g. `'whk_live_••••••••1a2b'`). Also the copy/reveal fallback. */
  value: string;
  /** Full secret shown when revealed. Defaults to `value`. */
  revealedValue?: string;
  /** Visible non-secret prefix (e.g. `'whk_live_'`). */
  prefix?: string;
  /** Visible non-secret tail (e.g. `'1a2b'`). */
  tail?: string;
  /** Start masked. Default `true`. */
  masked?: boolean;
  /** Fired the first time the field is revealed (audit hook). */
  onReveal?: () => void;
  /** Show a copy-to-clipboard button. Default `true`. */
  copyable?: boolean;
}

const DOTS = '••••••••••••••••';

export function SecretField({
  value,
  revealedValue,
  prefix,
  tail,
  masked = true,
  onReveal,
  copyable = true,
  className,
  ...rest
}: SecretFieldProps) {
  const [revealed, setRevealed] = useState(!masked);
  const [hasRevealed, setHasRevealed] = useState(!masked);

  const full = revealedValue ?? value;

  function toggle() {
    const next = !revealed;
    setRevealed(next);
    if (next && !hasRevealed) {
      setHasRevealed(true);
      onReveal?.();
    }
  }

  return (
    <div className={cn('lk-secretfield', className)} {...rest}>
      <span
        className="lk-secretfield-key"
        aria-hidden="true"
        data-testid="lk-secretfield-key"
      >
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="15" r="4.5" />
          <path d="M11 12l8-8M16 4h4v4" />
        </svg>
      </span>

      <code className="lk-secretfield-val">
        {revealed ? (
          <span className="lk-secretfield-full">{full}</span>
        ) : (
          <>
            {prefix != null && (
              <span className="lk-secretfield-prefix">{prefix}</span>
            )}
            <span className="lk-secretfield-dots">{DOTS}</span>
            {tail != null && (
              <span className="lk-secretfield-tail">{tail}</span>
            )}
            {prefix == null && tail == null && (
              <span className="lk-secretfield-masked">{value}</span>
            )}
          </>
        )}
      </code>

      <div className="lk-secretfield-acts">
        <button
          type="button"
          className="lk-secretfield-toggle"
          onClick={toggle}
          aria-pressed={revealed}
          aria-label={revealed ? 'Hide secret' : 'Reveal secret'}
          title={revealed ? 'Hide' : 'Reveal'}
        >
          <Icon name={revealed ? 'eyeOff' : 'eye'} size={15} />
        </button>
        {copyable && (
          <CopyButton
            className="lk-secretfield-copy"
            value={full}
            aria-label="Copy secret"
            title="Copy"
          />
        )}
      </div>
    </div>
  );
}

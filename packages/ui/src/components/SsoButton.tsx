import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';

export type SsoProvider = 'google' | 'apple';

export interface SsoButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Which identity provider this button signs in with. */
  provider: SsoProvider;
}

/**
 * SSO sign-in button (web twin of native `SsoButton`) — full-color Google "G"
 * or monochrome Apple glyph + a "Google" / "Apple" label. Renders a real
 * `<button>` so it takes `onClick`, `disabled`, `type`, etc. Stretches to fill
 * its grid cell (auth screens lay two side by side).
 *
 * The brand glyphs use fixed brand colors (Google's 4-color G, Apple's mark) —
 * those are brand marks, not themeable surfaces; every themeable surface (bg,
 * border, label) is token-driven.
 */
export function SsoButton({ provider, className, disabled, ...rest }: SsoButtonProps) {
  const label = provider === 'google' ? 'Google' : 'Apple';
  return (
    <button
      type="button"
      className={cn('lk-sso', className)}
      disabled={disabled}
      aria-label={`Continue with ${label}`}
      {...rest}
    >
      <span className="lk-sso-icon" aria-hidden="true">
        {provider === 'google' ? <GoogleBrandIcon /> : <AppleBrandIcon />}
      </span>
      <span className="lk-sso-label">{label}</span>
    </button>
  );
}

/** Google's four-color "G" brand mark. */
function GoogleBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
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
}

/** Apple mark — monochrome, follows the button text color via `currentColor`. */
function AppleBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.78c.02 2.5 2.19 3.33 2.21 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.1-2.63-2.11-1.43-2.07-2.53-5.86-1.06-8.42a4.1 4.1 0 0 1 3.46-2.1c1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.2-.77.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.07-1.8 3.21M14.3 4.6c.58-.71.98-1.69.87-2.68-.84.04-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.48 2.49-1.16" />
    </svg>
  );
}

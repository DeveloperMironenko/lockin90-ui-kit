'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../cn';

export type OAuthProvider = 'google' | 'apple';

interface OAuthCommonProps {
  /** Which social provider this button signs in with. */
  provider: OAuthProvider;
  /** Shows an inline spinner, sets `aria-busy`, and disables the button. */
  loading?: boolean;
  /** Overrides the default `Continue with Google` / `Continue with Apple` label. */
  label?: string;
  className?: string;
}

export type OAuthButtonProps = OAuthCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof OAuthCommonProps>;

const DEFAULT_LABEL: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
  apple: 'Continue with Apple',
};

/**
 * The official 4-color Google "G" mark (blue / green / yellow / red), inline so
 * it ships with the kit and stays brand-exact. `aria-hidden` — the button's text
 * carries the accessible name.
 */
function GoogleG() {
  return (
    <svg
      className="lk-oauth-logo"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

/** The Apple logo glyph, drawn in white to sit on the black Apple button. */
function AppleLogo() {
  return (
    <svg
      className="lk-oauth-logo"
      width="18"
      height="18"
      viewBox="0 0 814 1000"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFFFFF"
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.2z"
      />
    </svg>
  );
}

/**
 * Brand-compliant social sign-in button (Google / Apple). Full-width pill sized
 * to match the kit `Button` (48px height, pill radius) — meant to sit below the
 * email/password form on the auth screens.
 *
 * Brand colors are fixed per the official sign-in guidelines (Google white +
 * 4-color "G"; Apple black + white Apple logo) and are NOT themed by the Aurora
 * tokens, so the rendered button passes OAuth / app-store brand review.
 */
export default function OAuthButton({
  provider,
  loading,
  label,
  className,
  type,
  disabled,
  ...rest
}: OAuthButtonProps) {
  const text = label ?? DEFAULT_LABEL[provider];
  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'lk-oauth',
        provider === 'google' ? 'lk-oauth-google' : 'lk-oauth-apple',
        className,
      )}
      aria-busy={loading || undefined}
      disabled={disabled || loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="lk-oauth-spinner" aria-hidden="true" />
      ) : provider === 'google' ? (
        <GoogleG />
      ) : (
        <AppleLogo />
      )}
      <span className="lk-oauth-label">{text}</span>
    </button>
  );
}

'use client';

import type { ReactNode } from 'react';
import { cn } from '../../cn';
import Avatar from '../Avatar';

export interface AppHeaderProps {
  /** Display title, e.g. "Today". */
  title?: string;
  /** Small mono label shown above/left of the title, e.g. "LOCKIN90". */
  eyebrow?: string;
  /** Account display name — used for avatar initials + the a11y label. */
  accountName?: string;
  /** Explicit override of the avatar initials (else derived from `accountName`). */
  accountInitials?: string;
  /** Tap handler for the account button (router nav happens in the app). */
  onAccountPress?: () => void;
  /** WEB ONLY — render the account button as an `<a href>` instead of a `<button>`. */
  accountHref?: string;
  /** Optional extra right-side node placed BEFORE the avatar (e.g. a sync icon). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Top app bar — brand/title on the left, an account avatar button on the right.
 * The native counterpart (`@lockin90/ui-native` AppHeader) shares the same prop API.
 */
export default function AppHeader({
  title,
  eyebrow,
  accountName,
  accountInitials,
  onAccountPress,
  accountHref,
  trailing,
  className,
}: AppHeaderProps) {
  // `Avatar` derives its initials from `name` (first letter of up to 2 words).
  // To honor an explicit `accountInitials` override (e.g. "ZZ") we feed a name
  // whose derivation reproduces it verbatim — space the chars out ("Z Z") so the
  // shared Avatar shows exactly those letters without changing the Avatar API.
  const avatarName = accountInitials
    ? accountInitials.trim().split('').join(' ')
    : accountName;
  const avatar = <Avatar gradient="flux" name={avatarName} size={36} />;
  const accountLabel = accountName ?? 'Account';

  return (
    <header className={cn('lk-appheader', className)}>
      <div className="lk-appheader-left">
        {eyebrow && <span className="lk-eyebrow">{eyebrow}</span>}
        {title && (
          <h1 className="lk-display lk-appheader-title">{title}</h1>
        )}
      </div>
      <div className="lk-appheader-right">
        {trailing}
        {accountHref != null ? (
          <a
            className="lk-appheader-account"
            href={accountHref}
            aria-label={accountLabel}
          >
            {avatar}
          </a>
        ) : (
          <button
            type="button"
            className="lk-appheader-account"
            onClick={onAccountPress}
            aria-label={accountLabel}
          >
            {avatar}
          </button>
        )}
      </div>
    </header>
  );
}

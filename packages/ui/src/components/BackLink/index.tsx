'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../cn';

export interface BackLinkProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Text after the chevron. Default "Back". */
  label?: string;
  className?: string;
}

/**
 * Back-navigation affordance — a left chevron + label, used at the top of
 * sub-pages (account, changelog, …) so there's always a visible way back. The
 * web twin of the native `@lockin90/ui-native` BackLink (same chevron + muted
 * tone). Renders a real <button>; wire `onClick` to `router.back()`.
 */
export default function BackLink({ label = 'Back', className, type, ...rest }: BackLinkProps) {
  return (
    <button type={type ?? 'button'} className={cn('lk-backlink', className)} {...rest}>
      <svg
        className="lk-backlink-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M15 19l-7-7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

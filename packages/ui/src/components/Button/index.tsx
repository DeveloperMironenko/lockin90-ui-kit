'use client';

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '../motion';
import { cn } from '../../cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'default';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'lk-btn-primary',
  // 'secondary' is a back-compat alias (pre-Aurora kit / admin app) → ghost styling.
  secondary: 'lk-btn-ghost',
  ghost: 'lk-btn-ghost',
  danger: 'lk-btn-danger',
  default: '',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  block?: boolean;
  /** Magnetic pull toward the pointer (primary CTAs). `true` = 0.3 strength. */
  magnetic?: boolean | number;
  /** Shows an inline spinner, sets `aria-busy`, and disables the button. */
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

export type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

function classes({ variant = 'primary', size = 'md', block, className }: CommonProps): string {
  return cn(
    'lk-btn',
    VARIANT_CLASS[variant],
    size === 'sm' && 'lk-btn-sm',
    block && 'lk-btn-block',
    className,
  );
}

/**
 * Aurora pill button. Renders a `<button>`, or an `<a>` when `href` is given —
 * no framework router dependency (wrap with your own `<Link asChild>` if needed).
 */
export default function Button(props: ButtonProps | ButtonLinkProps) {
  const { magnetic = false } = props;
  const strength = magnetic === true ? 0.3 : typeof magnetic === 'number' ? magnetic : 0;
  const mag = useMagnetic(strength || 0.3);
  const magProps = strength
    ? { ref: mag.ref as never, onPointerMove: mag.onPointerMove, onPointerLeave: mag.onPointerLeave }
    : {};

  if ('href' in props && props.href !== undefined) {
    const { variant, size, block, magnetic: _m, loading: _l, className, children, ...rest } =
      props as ButtonLinkProps;
    return (
      <a className={classes({ variant, size, block, className, children })} {...magProps} {...rest}>
        {children}
      </a>
    );
  }

  const { variant, size, block, magnetic: _m, loading, className, children, type, disabled, ...rest } =
    props as ButtonProps;
  return (
    <button
      type={type ?? 'button'}
      className={classes({ variant, size, block, className, children })}
      aria-busy={loading || undefined}
      disabled={disabled || loading || undefined}
      {...magProps}
      {...rest}
    >
      {loading && <span className="lk-btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

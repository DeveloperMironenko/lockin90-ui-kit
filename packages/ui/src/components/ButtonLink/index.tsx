import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

/**
 * Legacy variant vocabulary preserved from the pre-Aurora kit so the admin app
 * imports unchanged. Maps onto the Aurora `lk-btn-*` classes.
 */
export type ButtonLinkVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASS: Record<ButtonLinkVariant, string> = {
  primary: 'lk-btn-primary',
  secondary: 'lk-btn-ghost',
  ghost: 'lk-btn-ghost',
};

// Local (not re-exported) — the barrel already surfaces `ButtonLinkProps` from Button.
interface ButtonLinkComponentProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> {
  href: string;
  variant?: ButtonLinkVariant;
  children: ReactNode;
  className?: string;
}

/**
 * An `<a>` styled like the Aurora pill button — no router dependency. Use this
 * for navigation; use `Button` for actions.
 */
export default function ButtonLink({
  href,
  variant = 'primary',
  children,
  className,
  ...rest
}: ButtonLinkComponentProps) {
  return (
    <a href={href} className={cn('lk-btn', VARIANT_CLASS[variant], className)} {...rest}>
      {children}
    </a>
  );
}

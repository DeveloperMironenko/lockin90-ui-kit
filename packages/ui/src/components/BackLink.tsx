import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

type CommonProps = {
  /** Visible label after the chevron. @default 'Back' */
  label?: string;
  /** When set, renders an `<a href>`; otherwise a `<button type="button">`. */
  href?: string;
  onClick?: () => void;
  className?: string;
  /**
   * Visual variant.
   * - `'default'` — flat accent text link (the original look).
   * - `'pill'` — glass-chip mono affordance (matches the auth brand-panel
   *   "Back to site" button: bordered glass surface, dim mono label, no
   *   icon nudge on hover).
   * @default 'default'
   */
  variant?: 'default' | 'pill';
};

export type BackLinkProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

/** "‹ Back" navigation affordance — chevron-left glyph + label, in accent. */
export function BackLink({
  label = 'Back',
  href,
  onClick,
  className,
  variant = 'default',
  ...rest
}: BackLinkProps) {
  const rootClass = cn('lk-backlink', variant === 'pill' && 'lk-backlink--pill', className);
  const content = (
    <>
      <Icon name="back" size={18} className="lk-backlink-icon" />
      <span>{label}</span>
    </>
  );

  if (href != null) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={rootClass}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={rootClass}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

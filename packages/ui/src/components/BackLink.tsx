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
};

export type BackLinkProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

/** "‹ Back" navigation affordance — chevron-left glyph + label, in accent. */
export function BackLink({ label = 'Back', href, onClick, className, ...rest }: BackLinkProps) {
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
        className={cn('lk-backlink', className)}
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
      className={cn('lk-backlink', className)}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

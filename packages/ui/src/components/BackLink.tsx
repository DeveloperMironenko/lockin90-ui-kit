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
   * - `'bar'` — the signed-in top bar's back chip (design `web/settings.html` `.topbar .backlink`): the
   *   pill's surface in the UI font, 13px with a 15px icon, 36px tall.
   * @default 'default'
   */
  variant?: 'default' | 'pill' | 'bar';
  /** The control size of the `pill` / `bar` surface (CONVENTIONS "Control sizes"): `md` 44 tall (a screen's
   *  back control), `sm` 36 with a 44 target (a compact header). The `default` text link is 44 to touch at
   *  phone width either way. @default 'md' */
  size?: 'md' | 'sm';
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
  size = 'md',
  ...rest
}: BackLinkProps) {
  const rootClass = cn(
    'lk-backlink',
    variant === 'pill' && 'lk-backlink--pill',
    variant === 'bar' && 'lk-backlink--pill lk-backlink--bar',
    variant !== 'default' && size === 'sm' && 'lk-backlink--sm',
    className,
  );
  const content = (
    <>
      <Icon name="back" size={variant === 'default' ? 18 : size === 'sm' ? 14 : 16} className="lk-backlink-icon" />
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

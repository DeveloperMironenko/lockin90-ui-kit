import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'sso';
export type ButtonTone = 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /**
   * Destructive tone — composes with `variant`. On the `default` variant it
   * paints a solid `--bad` fill (the primary destructive action); on `ghost`
   * it becomes a red-tinted transparent button (the account "danger zone"
   * delete). Uses the `--bad` status token.
   */
  tone?: ButtonTone;
  size?: 'sm' | 'md';
  /** optional icon/node rendered before the label (e.g. an SSO brand logo) */
  leading?: ReactNode;
  /** optional icon/node rendered after the label (e.g. a trailing arrow) */
  trailing?: ReactNode;
}

/** Pill button. `primary` = animated energy-gradient CTA. `tone="danger"` composes
 *  with `variant` for destructive actions (solid red on `default`, red-tinted on
 *  `ghost`). `leading`/`trailing` render an icon before/after the label (auto-spaced
 *  + sized by the `.lk-btn` flex gap). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', tone, size = 'md', leading, trailing, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'lk-btn',
        variant === 'primary' && 'lk-btn-primary',
        variant === 'ghost' && 'lk-btn-ghost',
        variant === 'sso' && 'lk-btn-sso',
        tone === 'danger' && 'lk-btn--tone-danger',
        size === 'sm' && 'lk-btn-sm',
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
});

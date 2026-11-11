import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'text' | 'sso';
export type ButtonTone = 'danger' | 'muted';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /**
   * Destructive tone — composes with `variant`. On the `default` variant it
   * paints a solid `--bad` fill (the primary destructive action); on `ghost`
   * it becomes a red-tinted transparent button (the account "danger zone"
   * delete). Uses the `--bad` status token. `muted` is for the `text` variant only: a
   * faint mono link that brightens on hover, for a quiet way out ("Skip setup").
   */
  tone?: ButtonTone;
  /** `lg`: the closing CTA of a flow ("Enter LockIn90", design onboarding `.enter-cta`) */
  size?: 'sm' | 'md' | 'lg';
  /** optional icon/node rendered before the label (e.g. an SSO brand logo) */
  leading?: ReactNode;
  /** optional icon/node rendered after the label (e.g. a trailing arrow) */
  trailing?: ReactNode;
  /** busy: the kit Spinner over the kept (hidden) label, so the width never changes; `aria-busy`, and
   *  presses (and a form submit) are ignored until it ends. The button stays focusable and named. */
  loading?: boolean;
}

// the spinner's size per button size, and its colour per surface (the label's colour, which loading hides)
const SPIN_SIZE = { sm: 14, md: 16, lg: 18 } as const;

/** Pill button. `primary` = animated energy-gradient CTA. `text` = a bare mono accent
 *  action inside a line of text ("Resend code"), with no surface. `tone="danger"` composes
 *  with `variant` for destructive actions (solid red on `default`, red-tinted on
 *  `ghost`). `leading`/`trailing` render an icon before/after the label (auto-spaced
 *  + sized by the `.lk-btn` flex gap). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    tone,
    size = 'md',
    leading,
    trailing,
    loading = false,
    className,
    type = 'button',
    children,
    onClick,
    ...rest
  },
  ref,
) {
  // `text` has no surface: size and the danger tone don't apply; `muted` is its own (Button.md)
  const surface = variant !== 'text';
  const dark = variant === 'primary' || (surface && tone === 'danger' && variant !== 'ghost');
  const spinColor = dark ? '#0A0A12' : variant === 'text' ? 'var(--accent-2)' : variant === 'ghost' && tone === 'danger' ? 'var(--bad)' : 'var(--text)';
  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'lk-btn',
        variant === 'primary' && 'lk-btn-primary',
        variant === 'ghost' && 'lk-btn-ghost',
        variant === 'text' && 'lk-btn-text',
        variant === 'sso' && 'lk-btn-sso',
        surface && tone === 'danger' && 'lk-btn--tone-danger',
        !surface && tone === 'muted' && 'lk-btn--tone-muted',
        surface && size === 'sm' && 'lk-btn-sm',
        surface && size === 'lg' && 'lk-btn-lg',
        loading && 'lk-btn-loading',
        className,
      )}
      aria-busy={loading || undefined}
      onClick={click}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
      {loading ? (
        <span className="lk-btn-spin" aria-hidden="true">
          <Spinner size={variant === 'text' ? 12 : SPIN_SIZE[size]} thickness={2} color={spinColor} />
        </span>
      ) : null}
    </button>
  );
});

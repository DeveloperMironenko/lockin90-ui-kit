import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** Leading slot — an icon, avatar, badge, or letter chip (flex-shrink 0). */
  leading?: ReactNode;
  /** Primary line. */
  title: ReactNode;
  /** Optional dimmer second line under the title. */
  subtitle?: ReactNode;
  /** Trailing slot — a chevron, value, or icon (pinned to the right). */
  trailing?: ReactNode;
  /** When set, the row renders as a `<button>` (hover bg, pointer). */
  onClick?: () => void;
  /** Shown but unavailable (e.g. "coming soon"): dimmed, announced disabled, not pressable. */
  disabled?: boolean;
  /** Accent-tinted selected state (used in pickers). */
  active?: boolean;
  /** Overrides the ACTIVE-state background — a translucent color string
   *  (e.g. the change-exercise cyan `'rgba(34,211,238,0.09)'`, design
   *  `.exl.on`). Default keeps the accent tint. */
  activeTint?: string;
  /** Danger tone — tints the title `--zone-low`. */
  danger?: boolean;
  /** A row of its own: bordered glass box, no hairline to its neighbours (a summary list,
   *  design onboarding `.recap li`). */
  boxed?: boolean;
  /** A settings row as the design draws them (`web/settings.html`): `pref` a preference with its control
   *  (15 × 4, a 600 14px title), `action` an account action (16 × 0, a 600 14.5px title). The card
   *  around it keeps its own padding. */
  variant?: 'pref' | 'action';
}

/** Generic tappable list item — leading + title/subtitle + trailing. Used for
 *  pickers, similar-exercise rows, and settings lists. Adjacent rows draw a
 *  hairline between them (handled in CSS). With `onClick` it renders an
 *  interactive `<button>`; otherwise a static `<div>`. */
export const ListRow = forwardRef<HTMLDivElement, ListRowProps>(function ListRow(
  { leading, title, subtitle, trailing, onClick, disabled, active, activeTint, danger, boxed, variant, className, style, ...rest },
  ref,
) {
  const classes = cn(
    'lk-listrow',
    onClick && !disabled && 'lk-listrow-tappable',
    disabled && 'lk-listrow-disabled',
    active && 'lk-listrow-active',
    danger && 'lk-listrow-danger',
    boxed && 'lk-listrow-boxed',
    variant && `lk-listrow-${variant}`,
    className,
  );
  /* activeTint rides a CSS custom property the .lk-listrow-active bg reads */
  const rowStyle =
    activeTint != null
      ? ({ ...style, '--lk-listrow-active-bg': activeTint } as React.CSSProperties)
      : style;

  const body = (
    <>
      {leading != null && <span className="lk-listrow-leading">{leading}</span>}
      <span className="lk-listrow-main">
        <span className="lk-listrow-title">{title}</span>
        {subtitle != null && <span className="lk-listrow-subtitle">{subtitle}</span>}
      </span>
      {trailing != null && <span className="lk-listrow-trailing">{trailing}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        style={rowStyle}
        // focusable and announced; a click does nothing
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
        aria-pressed={active || undefined}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className={classes}
      style={rowStyle}
      // a role that carries the state, so screen readers say the row is unavailable
      {...(disabled ? { role: 'group', 'aria-disabled': true } : {})}
      {...rest}
    >
      {body}
    </div>
  );
});

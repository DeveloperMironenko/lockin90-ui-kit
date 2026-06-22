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
  /** Accent-tinted selected state (used in pickers). */
  active?: boolean;
  /** Danger tone — tints the title `--zone-low`. */
  danger?: boolean;
}

/** Generic tappable list item — leading + title/subtitle + trailing. Used for
 *  pickers, similar-exercise rows, and settings lists. Adjacent rows draw a
 *  hairline between them (handled in CSS). With `onClick` it renders an
 *  interactive `<button>`; otherwise a static `<div>`. */
export const ListRow = forwardRef<HTMLDivElement, ListRowProps>(function ListRow(
  { leading, title, subtitle, trailing, onClick, active, danger, className, ...rest },
  ref,
) {
  const classes = cn(
    'lk-listrow',
    onClick && 'lk-listrow-tappable',
    active && 'lk-listrow-active',
    danger && 'lk-listrow-danger',
    className,
  );

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
        onClick={onClick}
        aria-pressed={active || undefined}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    );
  }

  return (
    <div ref={ref} className={classes} {...rest}>
      {body}
    </div>
  );
});

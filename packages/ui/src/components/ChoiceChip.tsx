import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type ChoiceChipSize = 'sm' | 'md';

export interface ChoiceChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected (`.on`) state — accent border + tint + brighter text. */
  selected?: boolean;
  /** Pill size. */
  size?: ChoiceChipSize;
  /** Leading glow dot (ignored when `icon` is set). */
  leadingDot?: boolean;
  /** Leading glyph (overrides `leadingDot`). */
  icon?: ReactNode;
  /** Stacked grid-cell layout — icon above a small centred label, rounded rect,
   *  fills its grid cell (vs the default inline pill). For quick-action grids. */
  stacked?: boolean;
}

/**
 * ChoiceChip — a pressable, selectable filter pill (multi-select). Unlike the
 * display-only `Chip` (a `<span>`) and the single-select `SegmentedTabs`, this is
 * a real toggle `<button aria-pressed>` (keyboard = native button). Mirrors the
 * studio's `.pill` / `.pill.on` pattern; selected tint is the `--accent` token.
 */
export const ChoiceChip = forwardRef<HTMLButtonElement, ChoiceChipProps>(function ChoiceChip(
  { selected = false, size = 'md', leadingDot, icon, stacked = false, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type}
      aria-pressed={selected}
      className={cn(
        'lk-choicechip',
        selected && 'lk-choicechip-on',
        size === 'sm' && 'lk-choicechip-sm',
        stacked && 'lk-choicechip-stacked',
        className,
      )}
      {...rest}
    >
      {icon != null ? (
        <span className="lk-choicechip-icon">{icon}</span>
      ) : leadingDot ? (
        <span className="lk-choicechip-dot" />
      ) : null}
      <span className="lk-choicechip-label">{children}</span>
    </button>
  );
});

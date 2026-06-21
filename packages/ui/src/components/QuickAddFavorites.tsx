import { type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../cn';

/** One most-logged favorite, rendered as a one-tap "+ add" chip. */
export interface QuickAddFavorite {
  /** stable id passed back to `onAdd` (defaults to the lowercased label) */
  id?: string;
  /** primary label, e.g. "Coffee" */
  label: string;
  /** mono sub-label under the label, e.g. "130mg · 18×" */
  sub?: string;
  /** accent color — any CSS color or token var, e.g. `var(--lime)`. Drives the
   *  icon tint. Falls back to `--accent`. */
  accent?: string;
  /** SVG path `d` (rendered inside a 0 0 24 24 viewBox). Ignored for a custom `icon`. */
  path?: string;
  /** full custom icon node (overrides `path`) */
  icon?: ReactNode;
  /** accessible label for the chip (defaults to `Add {label}`) */
  ariaLabel?: string;
}

export interface QuickAddFavoritesProps {
  /** the favorites to render — defaults to the design's full example set */
  favorites?: QuickAddFavorite[];
  /** card heading */
  title?: string;
  /** mono sub-label in the head, e.g. "most-logged this week" */
  sub?: string;
  /** label for the trailing dashed ghost chip */
  newLabel?: string;
  /** fired with the resolved id when a favorite's "+ add" chip is pressed */
  onAdd?: (id: string) => void;
  /** fired when the trailing "＋ New favorite" ghost chip is pressed */
  onNew?: () => void;
  className?: string;
}

/** The design's example most-logged favorites (label · sub · accent · icon), in order. */
export const QUICK_ADD_FAVORITES: QuickAddFavorite[] = [
  { label: 'Coffee', sub: '130mg · 18×', accent: 'var(--zone-mid)', path: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3' },
  { label: 'Lunch', sub: '520 kcal · 12×', accent: 'var(--lime)', path: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v8M17 11v8' },
  { label: 'Magnesium', sub: '400mg · 11×', accent: 'var(--accent-3)', path: 'M3 9h18v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 18zM12 9v9' },
  { label: 'Run', sub: 'easy 5K · 7×', accent: 'var(--magenta)', path: 'M13 4a2 2 0 1 0 0 .01M5 22l3-6 4-2 2 4 3 1M9 12l2-4 4 1 2 3' },
  { label: 'Water', sub: '500ml · 24×', accent: 'var(--cyan)', path: 'M12 2.5C12 2.5 5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z' },
  { label: 'Nap', sub: '20 min · 5×', accent: 'var(--accent-2)', path: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' },
];

function favoriteId(f: QuickAddFavorite): string {
  return f.id ?? f.label.toLowerCase();
}

const PLUS_PATH = 'M12 5v14M5 12h14';

/** Quick-add favorites — a horizontal scroll row of most-logged items as
 *  one-tap "+ add" chips (icon + label + sub + a "+" affordance), plus a
 *  trailing dashed "＋ New favorite" ghost chip. Renders the showcase example
 *  by default. */
export function QuickAddFavorites({
  favorites = QUICK_ADD_FAVORITES,
  title = 'Quick add',
  sub = 'most-logged this week',
  newLabel = 'New favorite',
  onAdd,
  onNew,
  className,
}: QuickAddFavoritesProps) {
  return (
    <div className={cn('lk-card', 'lk-qa-card', className)}>
      <div className="lk-qa-head">
        <span className="lk-qa-title lk-display">{title}</span>
        {sub ? (
          <span className="lk-qa-sub lk-mono">
            <span className="lk-qa-dot">●</span> {sub}
          </span>
        ) : null}
      </div>
      <div className="lk-qa-row">
        {favorites.map((f) => {
          const id = favoriteId(f);
          return (
            <button
              key={id}
              type="button"
              className="lk-qa-chip"
              style={f.accent ? ({ ['--qc']: f.accent } as CSSProperties) : undefined}
              aria-label={f.ariaLabel ?? `Add ${f.label}`}
              onClick={(_e: MouseEvent<HTMLButtonElement>) => onAdd?.(id)}
            >
              <span className="lk-qa-ico">
                {f.icon ?? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={f.path} />
                  </svg>
                )}
              </span>
              <span className="lk-qa-main">
                <span className="lk-qa-t">{f.label}</span>
                {f.sub ? <span className="lk-qa-d lk-mono">{f.sub}</span> : null}
              </span>
              <span className="lk-qa-plus" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={PLUS_PATH} />
                </svg>
              </span>
            </button>
          );
        })}
        <button type="button" className="lk-qa-new" onClick={() => onNew?.()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={PLUS_PATH} />
          </svg>
          {newLabel}
        </button>
      </div>
    </div>
  );
}

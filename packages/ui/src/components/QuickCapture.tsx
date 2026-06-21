import { type CSSProperties, type MouseEvent } from 'react';
import { cn } from '../cn';

/** One quick-capture action tile in the log-hub grid. */
export interface QuickCaptureTile {
  /** stable id passed back to `onCapture` (defaults to the lowercased label) */
  id?: string;
  /** primary label, e.g. "Energy" */
  label: string;
  /** mono sub-label under the label, e.g. "how you feel now" */
  sub?: string;
  /** accent color — any CSS color or token var, e.g. `var(--lime)`. Drives the
   *  icon tint, the hover top-rule, and the icon glow. Falls back to `--accent`. */
  accent?: string;
  /** SVG path `d` (rendered inside a 0 0 24 24 viewBox). Ignore for a custom `icon`. */
  path?: string;
  /** full custom icon node (overrides `path`) */
  icon?: React.ReactNode;
  /** show the "Most used" flag pill + tinted "hot" surface */
  hot?: boolean;
  /** accessible label for the button (defaults to `Log {label}`) */
  ariaLabel?: string;
}

export interface QuickCaptureProps {
  /** the tiles to render — defaults to the design's full example set */
  tiles?: QuickCaptureTile[];
  /** fired with the tile (and its resolved id) when a tile is pressed */
  onCapture?: (tile: QuickCaptureTile, id: string) => void;
  className?: string;
}

/** The design's example log-hub tiles (label · accent · icon path), in order. */
export const QUICK_CAPTURE_TILES: QuickCaptureTile[] = [
  { label: 'Energy', sub: 'how you feel now', accent: 'var(--accent)', hot: true, ariaLabel: 'Log energy or mood', path: 'M13 2 4 14h7l-1 8 9-12h-7z' },
  { label: 'Meal', sub: 'macros & timing', accent: 'var(--lime)', hot: true, ariaLabel: 'Log a meal', path: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v8M17 11v8' },
  { label: 'Caffeine', sub: 'mg & sensitivity', accent: 'var(--zone-mid)', ariaLabel: 'Log caffeine', path: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3' },
  { label: 'Supplement', sub: 'dose & type', accent: 'var(--accent-3)', ariaLabel: 'Log a supplement', path: 'M3 9h18v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 18zM12 9v13.5' },
  { label: 'Workout', sub: 'load & RPE', accent: 'var(--magenta)', ariaLabel: 'Log a workout', path: 'M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10' },
  { label: 'Sleep', sub: 'override & naps', accent: 'var(--accent-2)', ariaLabel: 'Log sleep override', path: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' },
  { label: 'Water', sub: 'hydration ml', accent: 'var(--cyan)', ariaLabel: 'Log water', path: 'M12 2.5C12 2.5 5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z' },
  { label: 'Mood', sub: 'how you feel', accent: 'var(--zone-low)', ariaLabel: 'Log mood', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01' },
  { label: 'Journal', sub: 'free text', accent: 'var(--violet)', ariaLabel: 'Write a journal note', path: 'M4 4h13l3 3v13H4zM8 9h8M8 13h8M8 17h5' },
];

function tileId(t: QuickCaptureTile): string {
  return t.id ?? t.label.toLowerCase();
}

/** Log-hub quick-capture grid — large tappable tiles (icon + label + sub), each
 *  a one-tap action to log something (energy, meal, sleep, workout, mood…). */
export function QuickCapture({ tiles = QUICK_CAPTURE_TILES, onCapture, className }: QuickCaptureProps) {
  return (
    <div className={cn('lk-qc-grid', className)}>
      {tiles.map((t) => {
        const id = tileId(t);
        return (
          <button
            key={id}
            type="button"
            className={cn('lk-qc-tile', t.hot && 'lk-qc-hot')}
            style={t.accent ? ({ ['--c']: t.accent } as CSSProperties) : undefined}
            aria-label={t.ariaLabel ?? `Log ${t.label}`}
            onClick={(_e: MouseEvent<HTMLButtonElement>) => onCapture?.(t, id)}
          >
            {t.hot ? <span className="lk-qc-flag">Most used</span> : null}
            <span className="lk-qc-ico">
              {t.icon ?? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={t.path} />
                </svg>
              )}
            </span>
            <span className="lk-qc-label">{t.label}</span>
            {t.sub ? <span className="lk-qc-sub">{t.sub}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type DeltaDirection = 'up' | 'down' | 'flat';
/** `energy` — the training design's energy-affect chip: gain mint, cost AMBER
 *  (never red — red is reserved for PRs/danger), neutral gray. Derives from
 *  the direction like `auto` but maps `down` → amber instead of coral. */
export type DeltaTone = 'auto' | 'up' | 'down' | 'neutral' | 'energy';
export type DeltaSize = 'sm' | 'md';

export interface DeltaPillProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The signed change to show, e.g. '+12%', '-3', or 12. */
  value: string | number;
  /** Arrow direction. Omit to infer from the numeric sign of `value`. */
  direction?: DeltaDirection;
  /** Color tone. 'auto' (default) derives from `direction`. */
  tone?: DeltaTone;
  size?: DeltaSize;
  /** Render only the arrow glyph, no value text. */
  iconOnly?: boolean;
}

/** Infer up/down/flat from the numeric sign of a value (string or number).
 *  Normalizes the TRUE MINUS sign U+2212 ('−4', the design's negative glyph)
 *  to ASCII '-' before parsing so it doesn't lose the sign. */
function inferDirection(value: string | number): DeltaDirection {
  const n =
    typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/−/g, '-').replace(/[^0-9.+-]/g, ''));
  if (Number.isNaN(n) || n === 0) return 'flat';
  return n > 0 ? 'up' : 'down';
}

const TONE_FROM_DIR: Record<DeltaDirection, 'up' | 'down' | 'neutral'> = {
  up: 'up',
  down: 'down',
  flat: 'neutral',
};

// `downAmber` backs the `energy` tone's negative side (amber, never red).
const TONE_CLASS: Record<'up' | 'down' | 'neutral' | 'downAmber', string> = {
  up: 'lk-delta-up',
  down: 'lk-delta-down',
  downAmber: 'lk-delta-down-amber',
  neutral: 'lk-delta-neutral',
};

/** Up arrow path; flipped vertically for down, dash for flat. */
function ArrowGlyph({ direction }: { direction: DeltaDirection }) {
  if (direction === 'flat') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14" />
      </svg>
    );
  }
  // Up arrow. For 'down' we flip it vertically via transform so the same path serves both.
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={direction === 'down' ? { transform: 'scaleY(-1)' } : undefined}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

/** Compact directional pill: arrow + signed value, tinted by direction. */
export const DeltaPill = forwardRef<HTMLSpanElement, DeltaPillProps>(function DeltaPill(
  { value, direction, tone = 'auto', size = 'md', iconOnly = false, className, ...rest },
  ref,
) {
  const dir = direction ?? inferDirection(value);
  const resolvedTone =
    tone === 'auto'
      ? TONE_FROM_DIR[dir]
      : tone === 'energy'
        ? dir === 'down'
          ? 'downAmber'
          : TONE_FROM_DIR[dir]
        : tone;
  return (
    <span
      ref={ref}
      className={cn('lk-deltapill', TONE_CLASS[resolvedTone], size === 'sm' && 'lk-deltapill-sm', className)}
      {...rest}
    >
      <ArrowGlyph direction={dir} />
      {!iconOnly && <span className="lk-deltapill-val">{value}</span>}
    </span>
  );
});

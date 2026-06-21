import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** Radius of the ring gauge in the 56×56 viewBox (matches the design). */
const RING_R = 23;
/** Circumference 2πr ≈ 144.5 — the full dash length of the gauge arc. */
const RING_C = 2 * Math.PI * RING_R;

/** Clearance/effect readout chip shown on the right of a substance row. */
export interface ActiveSubstanceChip {
  /** Signal tone — drives the pill color. */
  tone?: ChipTone;
  /** Pill label, e.g. "−6 sleep pts" or "on track". */
  label: string;
}

/** One run of the meta line — `bold` emphasizes the value (e.g. "95mg"). */
export interface MetaSegment {
  text: string;
  bold?: boolean;
}

/** One live substance currently in the user's system. */
export interface ActiveSubstance {
  /** Substance name, e.g. "Caffeine". */
  name: string;
  /** Per-substance glow color (hex / any CSS color) — drives `--ac`. */
  color: string;
  /** Current level as a % of peak still remaining (0–100) — the ring fill. */
  remainingPct: number;
  /** Amount still active, the big number, e.g. "48". */
  mgActive: string;
  /** Mono meta line under the number — runs of text with optional bold. */
  meta?: MetaSegment[];
  /** Clearance/effect readout chip. */
  chip?: ActiveSubstanceChip;
  /** Time-since-dose label, e.g. "4h 02m". Hidden when empty. */
  since?: string;
  /** Unit label after the big number (defaults to "mg active"). */
  unit?: string;
  /** Leading glyph (defaults to a generic pill/capsule icon, tinted `--ac`). */
  icon?: ReactNode;
  /** Whether to show the pulsing "live" dot next to the name (default true). */
  live?: boolean;
}

export interface ActiveSubstanceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Substances currently active — one card per entry. */
  substances?: ActiveSubstance[];
  className?: string;
}

/** Generic capsule glyph, tinted to the substance color via `currentColor`. */
const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} aria-hidden="true">
    <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8 6l8 8" />
  </svg>
);

/** A single substance row, rendered inside the list. */
function Row({
  name,
  color,
  remainingPct,
  mgActive,
  meta,
  chip,
  since,
  unit = 'mg active',
  icon,
  live = true,
}: ActiveSubstance) {
  const pct = Math.max(0, Math.min(100, remainingPct));
  const dashoffset = RING_C * (1 - pct / 100);
  return (
    <article
      className={cn('lk-act-card', live && 'lk-act-live')}
      style={{ '--ac': color } as CSSProperties}
    >
      <div
        className="lk-act-gauge"
        role="img"
        aria-label={`${Math.round(pct)}% of peak remaining`}
      >
        <svg viewBox="0 0 56 56">
          <circle className="lk-act-track" cx="28" cy="28" r={RING_R} fill="none" strokeWidth="5" />
          <circle
            className="lk-act-prog"
            cx="28"
            cy="28"
            r={RING_R}
            fill="none"
            strokeWidth="5"
            strokeDasharray={RING_C.toFixed(1)}
            strokeDashoffset={dashoffset.toFixed(1)}
          />
        </svg>
        <span className="lk-act-pct">
          {Math.round(pct)}
          <small>%</small>
        </span>
      </div>

      <div className="lk-act-body">
        <div className="lk-act-head">
          <span className="lk-act-head-ico" style={{ color }} aria-hidden="true">
            {icon ?? DEFAULT_ICON}
          </span>
          <span className="lk-act-name">{name}</span>
          {live ? <span className="lk-act-live-dot" /> : null}
        </div>
        <div className="lk-act-big">
          <span className="lk-tnum">{mgActive}</span>
          <small> {unit}</small>
        </div>
        {meta && meta.length ? (
          <div className="lk-act-meta">
            {meta.map((seg, i) =>
              seg.bold ? <b key={i}>{seg.text}</b> : <span key={i}>{seg.text}</span>,
            )}
          </div>
        ) : null}
      </div>

      <div className="lk-act-side">
        {since ? (
          <span className="lk-act-since">
            since <b>{since}</b>
          </span>
        ) : null}
        {chip ? (
          <Chip tone={chip.tone ?? 'default'} dot>
            {chip.label}
          </Chip>
        ) : null}
      </div>
    </article>
  );
}

/** Default substances mirror the design example (caffeine + magnesium). */
const DEFAULT_SUBSTANCES: ActiveSubstance[] = [
  {
    name: 'Caffeine',
    color: '#FFB020',
    remainingPct: 37,
    mgActive: '48',
    meta: [
      { text: 'from ' },
      { text: '95mg', bold: true },
      { text: ' · ' },
      { text: '4h ago', bold: true },
      { text: ' · clears ' },
      { text: '~11pm', bold: true },
    ],
    since: '4h 02m',
    chip: { tone: 'mid', label: '−6 sleep pts' },
  },
  {
    name: 'Magnesium',
    color: '#34F5C5',
    remainingPct: 70,
    mgActive: '280',
    meta: [
      { text: 'evening dose · ' },
      { text: '1h ago', bold: true },
      { text: ' · supports sleep' },
    ],
    since: '1h 06m',
    chip: { tone: 'low', label: 'on track' },
  },
];

/** Active-substance card list — live "in your system now" rows. Each row glows
 *  in its substance color (left border + soft shadow via the inline `--ac`
 *  custom prop), shows a mini ring gauge of the current level, the amount still
 *  active, a meta line, the time since the dose, and a clearance/effect chip. */
export function ActiveSubstanceCard({
  substances = DEFAULT_SUBSTANCES,
  className,
  ...rest
}: ActiveSubstanceCardProps) {
  return (
    <div className={cn('lk-act', className)} {...rest}>
      {substances.map((s, i) => (
        <Row key={`${s.name}-${i}`} {...s} />
      ))}
    </div>
  );
}

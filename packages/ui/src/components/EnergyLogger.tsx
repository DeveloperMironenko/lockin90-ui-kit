import { useId, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Which of the 5 mood faces to draw — controls the eyes + mouth geometry. */
export type MoodFace = 'awful' | 'low' | 'okay' | 'good' | 'great';

/** A single quick-mood option in the 5-face row. */
export interface EnergyLoggerMood {
  /** which face to render (eyes + mouth shape) */
  face: MoodFace;
  /** uppercase mono caption under the face, e.g. "Good" */
  label: string;
  /** stroke/accent color for the face glyph (token-backed var or hex) */
  color: string;
  /** whether this face is the currently selected mood (exactly one expected) */
  selected?: boolean;
}

export interface EnergyLoggerProps extends HTMLAttributes<HTMLDivElement> {
  /** display question, top-left */
  question?: string;
  /** mono uppercase timestamp, top-right */
  timestamp?: string;
  /** big ring readout value, 0–100 */
  score?: number;
  /** zone label under the score, e.g. "High" */
  zone?: string;
  /** slider position 0–100 (drives the gradient fill + thumb) */
  sliderValue?: number;
  /** low-end scale caption, e.g. "drained" */
  lowLabel?: string;
  /** high-end scale caption, e.g. "charged" */
  highLabel?: string;
  /** the two numeric scale ticks between the captions, e.g. [34, 67] */
  scaleTicks?: [number, number];
  /** the 5 mood faces (one selected) */
  moods?: EnergyLoggerMood[];
  /** CTA button label */
  ctaLabel?: string;
}

/** Ring geometry — matches the design's 108×108 viewBox, r=48. */
const RING_R = 48;
const RING_C = 2 * Math.PI * RING_R; // 301.59…

/** Faithful reproduction of the design example's five mood faces. */
const DEFAULT_MOODS: EnergyLoggerMood[] = [
  { face: 'awful', label: 'Awful', color: 'var(--zone-low)' },
  { face: 'low', label: 'Low', color: 'var(--zone-mid)' },
  { face: 'okay', label: 'Okay', color: 'var(--cyan)' },
  { face: 'good', label: 'Good', color: 'var(--accent-3)', selected: true },
  { face: 'great', label: 'Great', color: 'var(--lime)' },
];

/** Draw the eyes + mouth (and brows on "great") for a given face color. */
function FaceGlyph({ face, color }: { face: MoodFace; color: string }) {
  const eyes = (
    <>
      <circle cx="12.5" cy="15" r="1.6" fill={color} />
      <circle cx="23.5" cy="15" r="1.6" fill={color} />
    </>
  );
  switch (face) {
    case 'awful':
      return (
        <svg viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          {eyes}
          <path d="M12 25c1.6-3 4-4.2 6-4.2S22.4 22 24 25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'low':
      return (
        <svg viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          {eyes}
          <path d="M12.5 24h11" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'okay':
      return (
        <svg viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          {eyes}
          <path d="M13 22.5c1.4 1.4 8.6 1.4 10 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'good':
      return (
        <svg viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          {eyes}
          <path d="M12 21c1.6 3 4 4.2 6 4.2s4.4-1.2 6-4.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'great':
      return (
        <svg viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          <path d="M10 14.5c1-1.4 3-1.4 4 0M22 14.5c1-1.4 3-1.4 4 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M11 20c1.8 3.6 4.4 5 7 5s5.2-1.4 7-5z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill="rgba(168,255,53,.12)"
          />
        </svg>
      );
  }
}

/** Inline energy logger — the signature quick-log surface: a big energy ring /
 *  readout on the left, an energy slider + a 5-face mood row (one selected) on
 *  the right, and a gradient "Log now" CTA. Static surface (the slider fill and
 *  ring fill are derived from `sliderValue` / `score`). */
export function EnergyLogger({
  question = "How's your energy?",
  timestamp = '9:42am · Wed',
  score = 72,
  zone = 'High',
  sliderValue = 72,
  lowLabel = 'drained',
  highLabel = 'charged',
  scaleTicks = [34, 67],
  moods = DEFAULT_MOODS,
  ctaLabel = 'Log now',
  className,
  ...rest
}: EnergyLoggerProps) {
  const uid = useId();
  const gradId = `lk-elog-grad-${uid}`;
  // progress fraction of the ring (0–1), drawn as a dash offset on a -90° rotated circle
  const frac = Math.max(0, Math.min(1, score / 100));
  const dashOffset = RING_C * (1 - frac);
  const v = `${sliderValue}%`;

  return (
    <div className={cn('lk-elog', 'lk-card', className)} {...rest}>
      <div className="lk-elog-head">
        <span className="lk-elog-q">{question}</span>
        <span className="lk-elog-ts lk-mono lk-tnum">{timestamp}</span>
      </div>

      <div className="lk-elog-ring">
        <svg viewBox="0 0 108 108" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="0.55" stopColor="var(--cyan)" />
              <stop offset="1" stopColor="var(--lime)" />
            </linearGradient>
          </defs>
          <circle className="lk-elog-track" cx="54" cy="54" r={RING_R} />
          <circle
            className="lk-elog-prog"
            cx="54"
            cy="54"
            r={RING_R}
            stroke={`url(#${gradId})`}
            strokeDasharray={RING_C.toFixed(1)}
            strokeDashoffset={dashOffset.toFixed(1)}
          />
        </svg>
        <div className="lk-elog-center">
          <span className="lk-elog-num lk-tnum">{score}</span>
          <span className="lk-elog-zone">{zone}</span>
        </div>
      </div>

      <div className="lk-elog-ctl">
        <div className="lk-elog-sliderwrap" style={{ ['--v']: v } as CSSProperties}>
          <div className="lk-elog-stk" aria-hidden="true" />
          <div className="lk-elog-sfill" />
          <div className="lk-elog-thumb" role="slider" aria-valuenow={sliderValue} aria-label="Energy level" />
        </div>
        <div className="lk-elog-scale">
          <span>{lowLabel}</span>
          <span className="lk-tnum">{scaleTicks[0]}</span>
          <span className="lk-tnum">{scaleTicks[1]}</span>
          <span>{highLabel}</span>
        </div>

        <div className="lk-elog-faces" role="group" aria-label="Quick mood">
          {moods.map((m, i) => (
            <button
              key={i}
              className="lk-elog-face"
              type="button"
              aria-pressed={m.selected ? 'true' : 'false'}
              aria-label={m.label}
            >
              <FaceGlyph face={m.face} color={m.color} />
              <span className="lk-elog-fname">{m.label}</span>
            </button>
          ))}
        </div>

        <button className="lk-elog-cta" type="button">
          <svg viewBox="0 0 24 24">
            <path d="M5 12l5 5L20 6" />
          </svg>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

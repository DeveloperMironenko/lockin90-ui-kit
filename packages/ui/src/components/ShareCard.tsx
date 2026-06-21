import { useId, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { BrandMark } from './BrandMark';

/** One bar of the weekly sparkline (0..100). */
export type ShareSpark = number;

/** A share target chip below the card. */
export interface ShareTarget {
  /** chip label, e.g. "Copy link" */
  label: string;
  /** glyph drawn inside the 24×24 stroked svg */
  icon: 'link' | 'instagram' | 'x' | 'more';
  /** filled gradient pill (the primary action) */
  primary?: boolean;
  onClick?: () => void;
}

export interface ShareCardProps extends HTMLAttributes<HTMLDivElement> {
  /** big energy score in the ring center (0..100) */
  score?: number;
  /** zone label under the score, e.g. "HIGH" */
  zone?: string;
  /** ring fill fraction 0..1; defaults to score/100 */
  ringFraction?: number;
  /** headline — first line is plain, the (optional) accent word is gradient */
  headline?: string;
  /** the gradient-tinted second word of the headline, e.g. "week." */
  headlineAccent?: string;
  /** sub pill copy, e.g. "+12% vs last week" */
  sub?: string;
  /** date / context eyebrow, e.g. "Jun 9 – 15 · Weekly recap" */
  date?: string;
  /** weekly sparkline values (0..100); the tallest bar is highlighted */
  spark?: ShareSpark[];
  /** hashtag / brand tag, e.g. "#LockIn90" */
  tag?: string;
  /** share-to chips rendered below the card */
  targets?: ShareTarget[];
  /** accessible label for the rendered card image */
  cardLabel?: string;
}

const DEFAULT_SPARK: ShareSpark[] = [48, 62, 55, 74, 68, 100, 82];

const DEFAULT_TARGETS: ShareTarget[] = [
  { label: 'Copy link', icon: 'link', primary: true },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'X', icon: 'x' },
  { label: 'More', icon: 'more' },
];

function TargetGlyph({ icon }: { icon: ShareTarget['icon'] }) {
  switch (icon) {
    case 'link':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
          <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4l16 16M20 4L4 20" strokeWidth="1.8" />
        </svg>
      );
    case 'more':
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

/** ring geometry: 120×120 viewBox, stroke ring at r=50 */
const R = 50;
const CIRC = 2 * Math.PI * R; // ~314.16

/**
 * ShareCard — a branded, shareable "story" card. A mesh-gradient canvas holds a
 * big energy-score ring, a headline stat with a gradient accent word, a weekly
 * sparkline, a date eyebrow, and the LockIn90 brand mark in the footer; a row of
 * share-target chips sits below the card.
 */
export function ShareCard({
  score = 84,
  zone = 'HIGH',
  ringFraction,
  headline = 'Strong',
  headlineAccent = 'week.',
  sub = '+12% vs last week',
  date = 'Jun 9 – 15 · Weekly recap',
  spark = DEFAULT_SPARK,
  tag = '#LockIn90',
  targets = DEFAULT_TARGETS,
  cardLabel,
  className,
  ...rest
}: ShareCardProps) {
  const uid = useId().replace(/:/g, '');
  const ringId = `lkShareRing-${uid}`;
  const frac = Math.max(0, Math.min(1, ringFraction ?? score / 100));
  const dashoffset = CIRC * (1 - frac);
  const peak = spark.length ? Math.max(...spark) : 0;

  const label =
    cardLabel ??
    `Shareable energy card: score ${score}, ${headline} ${headlineAccent}, ${sub}, ${date}. LockIn90.`;

  return (
    <div className={cn('lk-share', className)} {...rest}>
      <div className="lk-share-card" role="img" aria-label={label}>
        <div className="lk-share-pad">
          <div className="lk-share-eyb">{date}</div>

          <div className="lk-share-mid">
            <div className="lk-share-ringwrap">
              <svg className="lk-share-ring" viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--lime)" />
                    <stop offset="50%" stopColor="var(--cyan)" />
                    <stop offset="100%" stopColor="var(--violet)" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="11" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke={`url(#${ringId})`}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashoffset}
                  transform="rotate(-90 60 60)"
                />
                <text className="lk-share-num lk-tnum" x="60" y="58" textAnchor="middle" fontSize="40">
                  {score}
                </text>
                <text className="lk-share-zone" x="60" y="80" textAnchor="middle" fontSize="11" letterSpacing="4">
                  {zone}
                </text>
              </svg>

              <div className="lk-share-head">
                <div className="lk-share-headline lk-display">
                  {headline}
                  {headlineAccent ? (
                    <>
                      <br />
                      <span className="lk-share-grad">{headlineAccent}</span>
                    </>
                  ) : null}
                </div>
                {sub ? (
                  <span className="lk-share-sub lk-mono">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 15l5-5 4 4 6-7" />
                      <path d="M16 7h5v5" />
                    </svg>{' '}
                    {sub}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="lk-share-spark" aria-hidden="true">
              {spark.map((v, i) => (
                <span
                  key={i}
                  className={cn('lk-share-bar', { 'lk-share-bar-peak': v === peak })}
                  style={{ height: `${Math.max(0, Math.min(100, v))}%` }}
                />
              ))}
            </div>
          </div>

          <div className="lk-share-foot">
            <span className="lk-share-brand">
              <BrandMark variant="mark" size={30} aria-hidden />
              <span className="lk-share-nm">
                LockIn<span className="lk-gradient-text">90</span>
              </span>
            </span>
            {tag ? <span className="lk-share-tag lk-mono">{tag}</span> : null}
          </div>
        </div>
      </div>

      <div className="lk-share-targets" role="group" aria-label="Share to">
        {targets.map((t, i) => (
          <button
            key={i}
            type="button"
            className={cn('lk-share-tgt', { 'lk-share-tgt-primary': t.primary })}
            onClick={t.onClick}
          >
            <TargetGlyph icon={t.icon} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

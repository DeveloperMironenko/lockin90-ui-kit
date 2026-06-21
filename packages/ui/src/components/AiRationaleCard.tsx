import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** One "what drove this" contribution row. */
export interface AiFactor {
  /** factor label, e.g. 'Sleep' */
  name: string;
  /** signed point contribution, e.g. 6 or -5 */
  pts: number;
  /** direction — drives dot/track/points color (defaults to sign of `pts`) */
  dir?: 'pos' | 'neg';
  /** track fill, 0..100 (magnitude of influence) */
  fill: number;
}

export interface AiRationaleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** card title; ReactNode so the score can be a <span className="lk-gradient-text"> */
  title?: ReactNode;
  /** prose rationale; ReactNode so consumers can pass lk-ai-good / lk-ai-bad spans */
  prose?: ReactNode;
  /** "what drove this" contribution rows */
  factors?: AiFactor[];
  /** confidence percent 0..100 shown in the footer */
  confidence?: number;
  /** provenance line, e.g. 'model v4.2 · 14 logged events · 61d calibration' */
  source?: string;
  /** eyebrow over the title */
  eyebrow?: string;
  /** label of the status chip top-right (omit to hide) */
  badge?: string;
  /** heading for the factor list */
  factorsLabel?: string;
}

/** Format a signed point value with the typographic minus sign (U+2212). */
function fmtPts(pts: number): string {
  return pts < 0 ? `−${Math.abs(pts)}` : `+${pts}`;
}

/** AI summary / rationale surface — prose with colour-coded highlight spans
 *  (green = helped, red = hurt), a signed-contribution factor list with tracks,
 *  and a ✨ AI · confidence footer. Renders the showcase example by default. */
export function AiRationaleCard({
  title = (
    <>
      Why your energy is <span className="lk-gradient-text">78</span> today
    </>
  ),
  prose = (
    <p>
      Your <span className="lk-ai-good">8h 12m of sleep</span> and a dose of{' '}
      <span className="lk-ai-good">morning sunlight</span> set you up well and lifted today&rsquo;s baseline. But a{' '}
      <span className="lk-ai-bad">6:40pm espresso</span> landed deep inside your caffeine-sensitivity window, and{' '}
      <span className="lk-ai-bad">a missed lunch</span> left a mid-afternoon glucose gap &mdash; together they trimmed
      the high you&rsquo;d otherwise have hit.
    </p>
  ),
  factors = [
    { name: 'Sleep', pts: 6, dir: 'pos', fill: 75 },
    { name: 'Morning sunlight', pts: 3, dir: 'pos', fill: 38 },
    { name: 'Late caffeine', pts: -5, dir: 'neg', fill: 63 },
    { name: 'Missed lunch', pts: -4, dir: 'neg', fill: 50 },
  ],
  confidence = 84,
  source = 'model v4.2 · 14 logged events · 61d calibration',
  eyebrow = '✨ AI rationale',
  badge = 'narrative',
  factorsLabel = 'What drove this',
  className,
  ...rest
}: AiRationaleCardProps) {
  return (
    <div className={cn('lk-card', 'lk-ai', className)} {...rest}>
      <div className="lk-ai-head">
        <span className="lk-ai-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
          </svg>
        </span>
        <div>
          <span className="lk-ai-eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        {badge && (
          <Chip tone="accent" dot>
            {badge}
          </Chip>
        )}
      </div>
      <div className="lk-ai-prose">{prose}</div>
      {factors.length > 0 && (
        <div className="lk-ai-factors">
          <div className="lk-ai-flbl">{factorsLabel}</div>
          {factors.map((f, i) => {
            const sign = f.dir ?? (f.pts < 0 ? 'neg' : 'pos');
            return (
              <div key={i} className={cn('lk-ai-frow', sign === 'pos' ? 'is-pos' : 'is-neg')}>
                <span className="lk-ai-fdot" />
                <span className="lk-ai-fname">{f.name}</span>
                <span className="lk-ai-ftrack">
                  <i style={{ width: `${Math.max(0, Math.min(100, f.fill))}%` }} />
                </span>
                <span className="lk-ai-fpts lk-mono lk-tnum">{fmtPts(f.pts)}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="lk-ai-foot">
        {source && <span className="lk-ai-src">{source}</span>}
        {confidence != null && (
          <span className="lk-ai-conf">
            <span className="lk-ai-sparkle">✨</span> AI · <b className="lk-tnum">{confidence}%</b> confidence
          </span>
        )}
      </div>
    </div>
  );
}

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface InsightOfDayProps extends HTMLAttributes<HTMLDivElement> {
  /** small label in the eyebrow, before the date */
  eyebrow?: string;
  /** dated eyebrow, e.g. 'Jun 15' (rendered mono, accent) */
  date?: string;
  /** editorial headline */
  headline?: string;
  /** prose body — ReactNode so consumers can pass <span className="lk-iotd-pos">…</span>
   *  / lk-iotd-caution / lk-iotd-bad highlight spans inside <p> paragraphs */
  prose?: ReactNode;
  /** big gradient pull-stat, e.g. '+18%' */
  pullStat?: string;
  /** caption beside the pull-stat (may contain <br />) */
  pullLabel?: ReactNode;
  /** primary CTA label */
  ctaLabel?: string;
  /** dismiss-action label */
  dismissLabel?: string;
  /** primary CTA click */
  onCta?: () => void;
  /** dismiss click */
  onDismiss?: () => void;
}

const DEFAULT_PROSE = (
  <>
    <p>
      Across the last 3 weeks, your energy in the <span className="lk-iotd-pos">9–11am window</span> averaged 18% higher
      than your afternoons. The pattern holds on 14 of the last 21 days, so it's a real signal — not noise.
    </p>
    <p>
      It's strongest after nights you <span className="lk-iotd-pos">slept before 11pm</span>, and it collapses on days
      with <span className="lk-iotd-caution">screen time past midnight</span>. Front-load your hardest work and protect
      that window.
    </p>
  </>
);

/** Editorial "Insight of the day" card — dated eyebrow + headline, colour-coded
 *  prose, a gradient pull-stat, and a CTA row. Renders the showcase example by default. */
export function InsightOfDay({
  eyebrow = 'Insight of the day',
  date = 'Jun 15',
  headline = 'Your mornings are your superpower',
  prose = DEFAULT_PROSE,
  pullStat = '+18%',
  pullLabel = (
    <>
      morning energy
      <br />
      vs afternoon, 21-day avg
    </>
  ),
  ctaLabel = 'Protect your mornings',
  dismissLabel = 'Got it',
  onCta,
  onDismiss,
  className,
  ...rest
}: InsightOfDayProps) {
  return (
    <article className={cn('lk-card', 'lk-iotd', className)} {...rest}>
      <div className="lk-iotd-eyebrow">
        <span className="lk-iotd-dot" aria-hidden="true" />
        <span className="lk-iotd-lbl">{eyebrow}</span>
        {date && (
          <>
            <span className="lk-iotd-sep">·</span>
            <span className="lk-iotd-date lk-mono">{date}</span>
          </>
        )}
      </div>
      <h2 className="lk-iotd-headline lk-display">{headline}</h2>
      <div className="lk-iotd-prose">{prose}</div>
      <div className="lk-iotd-pull">
        <span className="lk-iotd-num lk-tnum">{pullStat}</span>
        <span className="lk-iotd-pulllbl">{pullLabel}</span>
      </div>
      <div className="lk-iotd-cta">
        <button className="lk-iotd-act" type="button" onClick={onCta}>
          {ctaLabel}
        </button>
        <button className="lk-iotd-dismiss" type="button" onClick={onDismiss}>
          {dismissLabel}
        </button>
      </div>
    </article>
  );
}

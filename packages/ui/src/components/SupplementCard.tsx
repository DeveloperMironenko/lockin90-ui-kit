import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { BarFill } from './BarFill';
import { Chip } from './Chip';

export type AdherenceTone = 'high' | 'mid' | 'low';

/** Short status label that mirrors the adherence tone. */
const STATUS_LABEL: Record<AdherenceTone, string> = {
  high: 'On track',
  mid: 'Building',
  low: 'Spotty',
};

export interface SupplementCardProps extends HTMLAttributes<HTMLElement> {
  /** Supplement name, e.g. "Magnesium glycinate". */
  name?: string;
  /** Dose + cadence line, e.g. "400mg · daily". */
  dose?: string;
  /** Purpose / benefit line under the header. */
  purpose?: string;
  /** Timing status chip label, e.g. "PM · evening". Hidden when empty. */
  timing?: string;
  /** Custom timing-chip icon (defaults to a moon glyph). */
  timingIcon?: ReactNode;
  /** Leading icon (defaults to a sun/energy glyph). */
  icon?: ReactNode;
  /** Days taken in the adherence window. */
  taken?: number;
  /** Length of the adherence window in days. */
  days?: number;
  /** Adherence value tone. Defaults to auto from the taken/days ratio. */
  tone?: AdherenceTone;
  /** Status chip label. Defaults to a short label derived from the tone. */
  status?: string;
  /** when false, the bar starts empty so it can animate in via reveal */
  visible?: boolean;
  className?: string;
}

/** Auto-tone the adherence value from the fraction when not given. */
function toneFor(frac: number): AdherenceTone {
  if (frac >= 0.8) return 'high';
  if (frac >= 0.5) return 'mid';
  return 'low';
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-3)' }} aria-hidden="true">
    <path d="M12 2v6M5.6 5.6l4.2 4.2M2 12h6M5.6 18.4l4.2-4.2M12 22v-6M18.4 18.4l-4.2-4.2M22 12h-6M18.4 5.6l-4.2 4.2" />
  </svg>
);

const DEFAULT_TIMING_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

/** Supplement-stack card — icon, name + dose, timing chip, purpose, and a
 *  taken-X/7-days adherence bar with a zone-colored value. */
export function SupplementCard({
  name = 'Magnesium glycinate',
  dose = '400mg · daily',
  purpose = 'Sleep onset & muscle recovery. Glycinate form for gentle absorption, taken with dinner.',
  timing = 'PM · evening',
  timingIcon,
  icon,
  taken = 6,
  days = 7,
  tone,
  status,
  visible = true,
  className,
  ...rest
}: SupplementCardProps) {
  const total = Math.max(1, days);
  const done = Math.max(0, Math.min(total, taken));
  const frac = done / total;
  const valTone = tone ?? toneFor(frac);
  const statusLabel = status ?? STATUS_LABEL[valTone];
  return (
    <article className={cn('lk-supp lk-card', className)} {...rest}>
      <div className="lk-supp-head">
        <div className="lk-supp-ico">{icon ?? DEFAULT_ICON}</div>
        <div>
          <div className="lk-supp-name">{name}</div>
          <div className="lk-supp-dose">{dose}</div>
        </div>
        {timing ? (
          <span className="lk-supp-timing">
            {timingIcon ?? DEFAULT_TIMING_ICON}
            {timing}
          </span>
        ) : null}
      </div>
      {purpose ? <p className="lk-supp-purpose">{purpose}</p> : null}
      <div className="lk-supp-adh">
        <span className="lk-supp-adh-lbl">Adherence</span>
        <BarFill value={frac} visible={visible} />
        <span
          className={cn('lk-supp-adh-val', 'lk-mono', 'lk-tnum', `lk-${valTone}`)}
          aria-label={`Taken ${done} of ${total} days`}
        >
          {done}/{total}
        </span>
        {statusLabel ? (
          <Chip tone={valTone} dot>
            {statusLabel}
          </Chip>
        ) : null}
      </div>
    </article>
  );
}

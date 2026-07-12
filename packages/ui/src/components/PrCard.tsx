import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { PrBadge } from './PrBadge';

/** PR state — `new`/`atPeak` get the red-tinted border/glow + red tag;
 *  `offPeak` a quiet amber text tag. */
export type PrCardState = 'new' | 'atPeak' | 'offPeak';

export interface PrCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /** Lift name (e.g. `'Back Squat'`). */
  name: string;
  /** Record kind, mono overline (e.g. `'Estimated 1RM'`). */
  kind: string;
  /** The record value (e.g. `'130 kg'`). */
  value: string;
  /** Dim mono detail (e.g. `'today · +2kg'`). */
  detail?: string;
  /** Record state — omit for a plain card with no tag. */
  state?: PrCardState;
  /** When set, the card renders as a `<button>`. */
  onPress?: () => void;
}

const STATE_TAG: Record<Exclude<PrCardState, 'offPeak'>, string> = {
  new: 'NEW',
  atPeak: 'AT PEAK',
};

/**
 * PrCard — a personal-record card: lift name + mono record kind, the record
 * value big in the display font, and a dim detail line. `new`/`atPeak`
 * records get the red-PR treatment — red-tinted border + soft red glow and a
 * red `PrBadge` tag (`NEW` / `AT PEAK`); `offPeak` keeps the plain glass
 * surface with a quiet amber `OFF PEAK` text tag.
 */
export function PrCard({ name, kind, value, detail, state, onPress, className, ...rest }: PrCardProps) {
  const hot = state === 'new' || state === 'atPeak';

  const body = (
    <>
      <span className="lk-prcard-top">
        <span className="lk-prcard-name">{name}</span>
        {hot ? (
          <PrBadge size="sm" label={STATE_TAG[state as 'new' | 'atPeak']} />
        ) : state === 'offPeak' ? (
          <span className="lk-prcard-off">OFF PEAK</span>
        ) : null}
      </span>
      <span className="lk-prcard-kind">{kind}</span>
      <span className="lk-prcard-value">{value}</span>
      {detail != null && <span className="lk-prcard-detail">{detail}</span>}
    </>
  );

  const classes = cn('lk-prcard', hot && 'lk-prcard-hot', onPress && 'lk-prcard-tappable', className);

  if (onPress) {
    return (
      <button type="button" className={classes} onClick={onPress} {...(rest as HTMLAttributes<HTMLButtonElement>)}>
        {body}
      </button>
    );
  }
  return (
    <div className={classes} {...rest}>
      {body}
    </div>
  );
}

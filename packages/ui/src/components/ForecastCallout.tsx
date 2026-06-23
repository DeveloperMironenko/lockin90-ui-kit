import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';
import { Icon, type IconName } from './Icon';

export type ForecastCalloutTone = 'accent' | 'positive' | 'negative' | 'warn';

export interface ForecastCalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** small leading label chip, e.g. 'Forecast' / '31-day' */
  chip?: string;
  /** the forecast prose (projected peak / dip); emphasized spans allowed */
  children: ReactNode;
  /** tone — colors the leading chip + left accent bar (default 'accent') */
  tone?: ForecastCalloutTone;
  /** optional leading glyph */
  icon?: IconName;
}

const TONE: Record<ForecastCalloutTone, string> = {
  accent: 'lk-fc-accent',
  positive: 'lk-fc-positive',
  negative: 'lk-fc-negative',
  warn: 'lk-fc-warn',
};

/** Map the callout tone to the matching Chip tone. */
const CHIP_TONE: Record<ForecastCalloutTone, ChipTone> = {
  accent: 'accent',
  positive: 'high',
  negative: 'low',
  warn: 'mid',
};

/**
 * Forecast callout — a tinted glass panel with a left accent bar in the tone
 * color, a tone-colored leading Chip (+ optional icon), then the projected
 * peak/dip prose. Mirrors the design `.callout` vocab. Compose Chip + Icon.
 */
export function ForecastCallout({
  chip,
  children,
  tone = 'accent',
  icon,
  className,
  ...rest
}: ForecastCalloutProps) {
  return (
    <div className={cn('lk-fc', TONE[tone], className)} role="note" {...rest}>
      {(chip || icon) && (
        <div className="lk-fc-top">
          {icon && (
            <span className="lk-fc-icon" aria-hidden="true">
              <Icon name={icon} size={16} />
            </span>
          )}
          {chip && (
            <Chip tone={CHIP_TONE[tone]} dot>
              {chip}
            </Chip>
          )}
        </div>
      )}
      <p className="lk-fc-text">{children}</p>
    </div>
  );
}

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

export type EffectTone = 'auto' | 'positive' | 'negative' | 'neutral';

export interface EffectAttributionLineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Signed contribution; rendered with an explicit + or − sign. */
  value: number;
  /** What the contribution is attributed to, e.g. 'Deep sleep 1h20m'. */
  label: ReactNode;
  /** Unit appended to the value, e.g. 'pts'. */
  unit?: string;
  /** Color tone. 'auto' (default) = positive if value>0, negative if <0, neutral if 0. */
  tone?: EffectTone;
  /** Optional leading glyph. */
  icon?: IconName;
}

const TONE_CLASS: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: 'lk-effectline-pos',
  negative: 'lk-effectline-neg',
  neutral: 'lk-effectline-neutral',
};

/** Resolve the effective tone from the explicit prop, falling back to the numeric sign. */
function resolveTone(tone: EffectTone, value: number): 'positive' | 'negative' | 'neutral' {
  if (tone !== 'auto') return tone;
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

/** Format the signed value with an explicit +/− and the magnitude (sign rendered separately). */
function formatMagnitude(value: number): string {
  return String(Math.abs(value));
}

function signFor(value: number): string {
  if (value > 0) return '+';
  if (value < 0) return '−';
  return '±';
}

/**
 * A single "why this score" attribution row: optional leading icon, a large
 * signed contribution (display font, tinted by tone) with unit, and the label
 * describing the driver. Stack several inside an energy-explain list.
 */
export function EffectAttributionLine({
  value,
  label,
  unit,
  tone = 'auto',
  icon,
  className,
  ...rest
}: EffectAttributionLineProps) {
  const resolved = resolveTone(tone, value);
  return (
    <div className={cn('lk-effectline', TONE_CLASS[resolved], className)} {...rest}>
      {icon != null && (
        <span className="lk-effectline-icon">
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className="lk-effectline-value lk-display lk-tnum">
        <span className="lk-effectline-sign">{signFor(value)}</span>
        {formatMagnitude(value)}
        {unit != null && <span className="lk-effectline-unit">{unit}</span>}
      </span>
      <span className="lk-effectline-label">{label}</span>
    </div>
  );
}

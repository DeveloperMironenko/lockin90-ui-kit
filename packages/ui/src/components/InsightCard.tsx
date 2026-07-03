import { type ReactNode } from 'react';
import { cn } from '../cn';
import { Card } from './Card';
import { Icon, type IconName } from './Icon';
import { Sparkline } from './Sparkline';
import { Chip } from './Chip';

export type InsightTone = 'default' | 'positive' | 'negative' | 'accent';

export interface InsightCardProps {
  /** optional heading */
  title?: string;
  /** the insight prose */
  body: ReactNode;
  /** optional Sparkline series, oldest → newest */
  data?: number[];
  /** chips: p-value / n / confidence (e.g. `{ label: 'p', value: '0.02' }`) */
  stats?: { label: string; value: string }[];
  /** accent color of the icon/sparkline */
  tone?: InsightTone;
  /** explicit accent color for the icon + sparkline — overrides `tone`'s color
   *  (e.g. `var(--lime)`). Lets each card carry its own trend hue. */
  accentColor?: string;
  /** fill the area under the sparkline (default true). Set false for a clean
   *  line-only trend, matching the design's per-pattern sparklines. */
  sparkFill?: boolean;
  /** leading glyph */
  icon?: IconName;
  className?: string;
}

/** Tone → accent color token for the icon + sparkline (matches the mockup). */
const TONE_COLOR: Record<InsightTone, string> = {
  default: 'var(--text-dim)',
  positive: 'var(--ok)',
  negative: 'var(--bad)',
  accent: 'var(--accent)',
};

/**
 * InsightCard — a glass panel surfacing a detected pattern: a leading icon +
 * title row, the insight prose, an optional tone-tinted Sparkline, and a row of
 * small stat Chips (p-value / n / confidence). Composed from Card + Icon +
 * Sparkline + Chip; `tone` drives the icon and sparkline accent. Mirrors the
 * `.insight` cards in the design mockup. Native twin: `@lockin90/ui-native`.
 */
export function InsightCard({
  title,
  body,
  data,
  stats,
  tone = 'default',
  accentColor,
  sparkFill = true,
  icon = 'sparkle',
  className,
}: InsightCardProps) {
  const color = accentColor ?? TONE_COLOR[tone];

  return (
    <Card hover className={cn('lk-insight', className)}>
      <div className="lk-insight-main">
        <div className="lk-insight-head">
          <span className="lk-insight-ic" style={{ color }}>
            <Icon name={icon} size={18} />
          </span>
          {title && <h4 className="lk-insight-title">{title}</h4>}
        </div>

        <p className="lk-insight-body">{body}</p>

        {stats && stats.length > 0 && (
          <div className="lk-insight-meta">
            {stats.map((s, i) => (
              <Chip key={`${s.label}-${i}`}>
                {s.label} = {s.value}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {data && data.length > 0 && (
        <div className="lk-insight-right">
          <Sparkline data={data} color={color} width={150} height={64} fill={sparkFill} />
        </div>
      )}
    </Card>
  );
}

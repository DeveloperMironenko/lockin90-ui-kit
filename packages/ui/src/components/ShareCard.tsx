import { forwardRef, type HTMLAttributes } from 'react';
import { gradients } from '@lockin90/tokens';
import { cn } from '../cn';
import { BrandMark } from './BrandMark';
import { GradientText } from './GradientText';
import { Ring } from './Ring';
import { Stat } from './Stat';

export type ShareCardGradient = 'flux' | 'cta' | 'mint' | 'violet';
export type ShareCardSize = 'sm' | 'md' | 'lg';

export interface ShareCardStat {
  label: string;
  value: string;
}

export interface ShareCardProps extends HTMLAttributes<HTMLDivElement> {
  /** small mono eyebrow above the metric (e.g. a date range or "Avg energy"). */
  title?: string;
  /** the headline — a number or short string (shown big, or inside the `ring`). */
  metric: string | number;
  /** small mono caption under the metric (e.g. a zone, "out of 100"). */
  metricLabel?: string;
  /** render a `Ring` with `metric` as its centered readout instead of a big number.
   *  `value` is mapped onto 0–100 against `max` (default 100). */
  ring?: { value: number; max?: number };
  /** up to 3 supporting stats (rendered with the `Stat` primitive). */
  stats?: ShareCardStat[];
  /** show the LockIn90 `BrandMark` lockup + watermark @default true */
  brand?: boolean;
  /** aurora mesh + ring/headline gradient @default 'flux' */
  gradient?: ShareCardGradient;
  /** share aspect + scale @default 'md' (sm 1:1 · md 4:5 · lg 9:16) */
  size?: ShareCardSize;
}

/** ring diameter / stroke / brand-mark size per size (the rest is CSS-driven). */
const SIZES: Record<ShareCardSize, { ring: number; thickness: number; brand: number }> = {
  sm: { ring: 96, thickness: 8, brand: 18 },
  md: { ring: 120, thickness: 9, brand: 20 },
  lg: { ring: 140, thickness: 10, brand: 22 },
};

/**
 * ShareCard — the branded, shareable progress/score card users post to socials:
 * a `BrandMark` lockup, a headline `metric` (a big `GradientText` number or a
 * `Ring` readout), an optional caption, and up to three supporting `Stat`s, all
 * on an Aurora-gradient mesh. The `gradient` token drives the mesh + ring/text
 * gradient; `size` picks the share aspect (1:1 / 4:5 / 9:16). Composed from
 * BrandMark + GradientText + Ring + Stat. Native twin: `@lockin90/ui-native`.
 *
 * This is the *only* sanctioned share card — never hand-roll a branded score
 * card (see SDD §9).
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { title, metric, metricLabel, ring, stats, brand = true, gradient = 'flux', size = 'md', className, ...rest },
  ref,
) {
  const S = SIZES[size];
  const g = gradients[gradient];
  const arc: [string, string] = [g.stops[0], g.stops[g.stops.length - 1]];
  // GradientText only exposes flux/cta/violet — mint headlines fall back to flux
  // (the mesh + ring still carry the true mint tint).
  const headlineGradient = gradient === 'cta' ? 'cta' : gradient === 'violet' ? 'violet' : 'flux';
  const ringPct = ring ? Math.max(0, Math.min(100, (ring.value / (ring.max ?? 100)) * 100)) : 0;
  const visibleStats = stats?.slice(0, 3) ?? [];

  return (
    <div
      ref={ref}
      className={cn('lk-sharecard', `lk-sharecard-${size}`, className)}
      data-gradient={gradient}
      {...rest}
    >
      <div className="lk-sharecard-mesh" aria-hidden="true" />

      <div className="lk-sharecard-top">{brand && <BrandMark variant="lockup" size={S.brand} />}</div>

      <div className="lk-sharecard-body">
        {title && <span className="lk-sharecard-eyebrow">{title}</span>}

        {ring ? (
          <Ring value={ringPct} size={S.ring} thickness={S.thickness} gradient={arc}>
            <span className="lk-sharecard-score lk-display lk-tnum">{metric}</span>
          </Ring>
        ) : (
          <GradientText gradient={headlineGradient} className="lk-sharecard-metric lk-tnum">
            {metric}
          </GradientText>
        )}

        {metricLabel && <span className="lk-sharecard-metric-label">{metricLabel}</span>}

        {visibleStats.length > 0 && (
          <div className="lk-sharecard-stats">
            {visibleStats.map((s, i) => (
              <Stat key={`${s.label}-${i}`} label={s.label} value={s.value} />
            ))}
          </div>
        )}
      </div>

      {brand && (
        <div className="lk-sharecard-foot">
          <span className="lk-sharecard-wm">lockin90.com</span>
        </div>
      )}
    </div>
  );
});

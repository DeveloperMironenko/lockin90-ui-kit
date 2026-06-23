import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Ring } from './Ring';
import { BrandMark } from './BrandMark';
import { Icon, type IconName } from './Icon';

/** Mesh / gradient backdrop colorway (mirrors the `@lockin90/tokens` gradients). */
export type ShareCardGradient = 'flux' | 'cta' | 'violet' | 'mint';
/** Export aspect ratio — `square` 1:1, `story` 9:16, `wide` 16:9. */
export type ShareCardAspect = 'square' | 'story' | 'wide';

export interface ShareCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** eyebrow above the value, e.g. `'Energy Score'` / `'Today'` */
  title?: string;
  /** big headline number / text, e.g. `'87'` */
  value?: string;
  /** `0..1` → a Ring drawn around the `value`. Omit to hide the ring. */
  ring?: number;
  /** small caption under the value */
  subtitle?: ReactNode;
  /** mesh / gradient backdrop @default 'flux' */
  gradient?: ShareCardGradient;
  /** show the corner BrandMark @default true */
  brand?: boolean;
  /** optional `data from {device}` provider logo, e.g. `'oura'` / `'whoop'` */
  device?: IconName;
  /** export aspect @default 'square' */
  aspect?: ShareCardAspect;
}

/** Per-gradient arc stops for the centre Ring (first → last of the token gradient). */
const RING_STOPS: Record<ShareCardGradient, [string, string]> = {
  flux: ['var(--lime)', 'var(--accent)'],
  cta: ['var(--accent)', 'var(--cyan)'],
  violet: ['var(--violet)', 'var(--indigo)'],
  mint: ['var(--mint)', 'var(--cyan)'],
};

/**
 * ShareCard — a branded, export-ready score card: a `void` panel filled with a
 * recolored radial-gradient **mesh** (per `gradient`) under a faint grid and a
 * glassy sheen, sized to `aspect` (1:1 / 9:16 / 16:9). Composes the shared
 * `Ring` (around the big `value`), the `BrandMark` lockup in a corner (when
 * `brand`), and a `data from • {device}` footer (when `device`). The most
 * visual primitive — tokens-driven; native twin lives in `@lockin90/ui-native`
 * with an identical name, props and visuals.
 */
export function ShareCard({
  title,
  value,
  ring,
  subtitle,
  gradient = 'flux',
  brand = true,
  device,
  aspect = 'square',
  className,
  ...rest
}: ShareCardProps) {
  const hasRing = typeof ring === 'number';

  const valueNode = value ? <span className="lk-sc-value lk-display lk-tnum">{value}</span> : null;

  return (
    <div
      className={cn('lk-sc', `lk-sc-${gradient}`, `lk-sc-${aspect}`, className)}
      role="img"
      aria-label={[title, value].filter(Boolean).join(' ') || 'Share card'}
      {...rest}
    >
      <div className="lk-sc-mesh" aria-hidden="true" />
      <div className="lk-sc-grid" aria-hidden="true" />
      <div className="lk-sc-sheen" aria-hidden="true" />

      {/* header: brand (corner) + device lockup */}
      {(brand || device) && (
        <div className="lk-sc-head">
          {brand ? <BrandMark variant="lockup" size={24} /> : <span />}
          {device ? (
            <div className="lk-sc-dev">
              <span className="lk-sc-dev-lbl lk-mono">data from</span>
              <span className="lk-sc-dev-dot" aria-hidden="true">
                •
              </span>
              <Icon name={device} size={20} className="lk-sc-dev-glyph" />
            </div>
          ) : null}
        </div>
      )}

      {/* center: title eyebrow + ring/value + subtitle */}
      <div className="lk-sc-body">
        {title ? <div className="lk-sc-title lk-mono">{title}</div> : null}
        {hasRing ? (
          <Ring
            value={Math.max(0, Math.min(1, ring)) * 100}
            size={184}
            thickness={14}
            gradient={RING_STOPS[gradient]}
            className="lk-sc-ring"
          >
            {valueNode}
          </Ring>
        ) : (
          valueNode
        )}
        {subtitle != null ? <div className="lk-sc-sub">{subtitle}</div> : null}
      </div>

      {/* footer watermark */}
      <div className="lk-sc-foot lk-mono">lockin90.com</div>
    </div>
  );
}

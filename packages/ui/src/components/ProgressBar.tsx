import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/**
 * Catalog variants (design catalog `progress-charts.html`, PL-01…PL-16).
 * Omit `variant` for the classic determinate/indeterminate bar.
 */
export type ProgressBarVariant =
  | 'progress' // PL-01
  | 'zone-progress' // PL-04
  | 'step-cells' // PL-08
  | 'milestone-line' // PL-09
  | 'ghost-compare' // PL-11
  | 'overflow-badge' // PL-13
  | 'head-pill' // PL-14
  | 'countdown-drain'; // PL-16

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * Progress fraction 0..1. When `undefined` the bar is **indeterminate** — a
   * gradient band sweeps continuously (use while a duration is unknown).
   * `overflow-badge` accepts values > 1 (the fill caps, the badge shows the over).
   */
  value?: number;
  /** Bar height in px (default 8 — the PL-01 SELECT: 3 hairline / 8 default / 18 thick). */
  height?: number;
  /** Fill paint — any CSS color OR gradient string (default the flux gradient; variants default `--mint`). */
  gradient?: string;
  /** The unfilled track color (default a faint glass rail). */
  track?: string;
  /** Optional label rendered above the bar (the variant title row). */
  label?: string;
  /** Render the percentage (classic default false; variants default true). */
  showValue?: boolean;
  /** Fully-rounded ends (default true). */
  rounded?: boolean;
  /** Render one of the catalog progress forms; omit → the classic bar. */
  variant?: ProgressBarVariant;
  /** Variant solid fill — any token var() (alternative to `gradient`). */
  color?: string;
  /** Mono sub-copy under the bar (e.g. `94 g logged · 36 g to go`). */
  sub?: string;
  /** `step-cells`: number of cells (default 10); filled = `round(value · steps)`. */
  steps?: number;
  /** Milestone fractions 0..1 — ticks + dots, lit when passed (`milestone-line` defaults 25/50/75). */
  milestones?: number[];
  /** `ghost-compare`: previous-period fraction 0..1 — white-16% layer under the fill. */
  ghost?: number;
  /** GOAL tick + pill at this fraction 0..1 (`--zone-mid`). */
  target?: number;
  /** Glow underlay behind the fill (blurred duplicate). */
  shine?: boolean;
}

/** catalog zone thresholds: ≥0.62 high · ≥0.38 mid · else low */
const zoneOf = (f: number) =>
  f >= 0.62 ? 'var(--zone-high)' : f >= 0.38 ? 'var(--zone-mid)' : 'var(--zone-low)';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** The catalog-variant renderer (internal). */
function VariantBar({
  variant,
  value,
  height = 8,
  gradient,
  track = 'rgba(255,255,255,0.07)',
  label,
  showValue,
  rounded = true,
  color,
  sub,
  steps = 10,
  milestones,
  ghost,
  target,
  shine,
  className,
  style,
  ...rest
}: ProgressBarProps & { variant: ProgressBarVariant }) {
  const raw = Math.max(0, value ?? 0);
  const vc = clamp01(raw); // clamped fraction (fill width, zone color)
  const overflowMode = variant === 'overflow-badge';
  // the readout is NOT capped in overflow mode (catalog shows e.g. 112%)
  const pct = Math.round((overflowMode ? raw : vc) * 100);
  const showPct = showValue ?? true;

  const zoneFill = variant === 'zone-progress';
  const fillPaint = zoneFill
    ? zoneOf(vc)
    : gradient ?? color ?? (variant === 'countdown-drain' ? 'var(--zone-low)' : 'var(--mint)');
  const pctColor = zoneFill ? zoneOf(vc) : 'var(--text)';
  // pill riding the fill head — cyan stand-in when the fill is a gradient (catalog rule)
  const headColor = gradient ? 'var(--cyan)' : fillPaint;

  const marks =
    variant === 'milestone-line' ? milestones ?? [0.25, 0.5, 0.75] : milestones;
  const hasMarks = !!marks && marks.length > 0 && variant !== 'step-cells';
  const hasPills = variant === 'head-pill' || target != null;

  const done = Math.round(vc * steps);

  const rootStyle = {
    '--lk-pb-h': `${height}px`,
    '--lk-pb-track': track,
    '--lk-pb-radius': rounded ? 'var(--r-pill)' : '0px',
    ...style,
  } as CSSProperties;

  const showFoot = sub != null || (overflowMode && raw > 1);

  return (
    <div
      className={cn('lk-progressbar', 'lk-pbv', `lk-pbv--${variant}`, className)}
      style={rootStyle}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(100, pct)}
      aria-label={label}
      {...rest}
    >
      {(label || showPct) && (
        <div className="lk-pbv-head">
          {label ? <span className="lk-pbv-title">{label}</span> : <span />}
          {showPct && (
            <span className="lk-pbv-pct lk-tnum" style={{ color: pctColor }}>
              {pct}%
            </span>
          )}
        </div>
      )}

      {variant === 'step-cells' ? (
        /* ---- PL-08: discrete cells + counter ---- */
        <>
          <div className="lk-pbv-cells" style={{ height }} aria-hidden="true">
            {Array.from({ length: Math.max(1, steps) }, (_, i) => (
              <i
                key={i}
                className="lk-pbv-cell"
                style={i < done ? { background: fillPaint } : undefined}
              />
            ))}
          </div>
          <div className="lk-pbv-sub">{sub ?? `${done} / ${steps} STEPS`}</div>
        </>
      ) : (
        <div className={cn('lk-pbv-rail', hasPills && 'has-pills', hasMarks && 'has-marks')}>
          {shine && (
            <i
              className="lk-pbv-shine"
              style={{ width: `${vc * 100}%`, background: fillPaint }}
              aria-hidden="true"
            />
          )}
          <div className="lk-progressbar-track" aria-hidden="true">
            {ghost != null && (
              <i className="lk-pbv-ghost" style={{ width: `${clamp01(ghost) * 100}%` }} />
            )}
            <i
              className={cn('lk-pbv-fill', variant === 'countdown-drain' && 'lk-pbv-fill--drain')}
              style={{ width: `${vc * 100}%`, background: fillPaint }}
            />
          </div>
          {hasMarks &&
            marks!.map((m) => (
              <span key={m} aria-hidden="true">
                <i className="lk-pbv-tick" style={{ left: `${clamp01(m) * 100}%` }} />
                <i
                  className="lk-pbv-dot"
                  style={{
                    left: `${clamp01(m) * 100}%`,
                    background: vc >= m ? fillPaint : 'rgba(255,255,255,0.2)',
                  }}
                />
              </span>
            ))}
          {target != null && (
            <>
              <i
                className="lk-pbv-goaltick"
                style={{ left: `${clamp01(target) * 100}%` }}
                aria-hidden="true"
              />
              <span
                className="lk-pbv-pill"
                style={{
                  color: 'var(--zone-mid)',
                  left: `clamp(28px, ${clamp01(target) * 100}%, calc(100% - 28px))`,
                }}
              >
                GOAL {Math.round(clamp01(target) * 100)}
              </span>
            </>
          )}
          {variant === 'head-pill' && (
            <span
              className="lk-pbv-pill"
              style={{
                color: headColor,
                left: `clamp(20px, ${vc * 100}%, calc(100% - 20px))`,
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      )}

      {showFoot && variant !== 'step-cells' && (
        <div className="lk-pbv-foot">
          {sub != null ? <span className="lk-pbv-sub">{sub}</span> : <span />}
          {overflowMode && raw > 1 && (
            <span className="lk-pbv-pill lk-pbv-pill--static" style={{ color: 'var(--lime)' }}>
              +{Math.round((raw - 1) * 100)} OVER
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Aurora-Flux linear progress bar with a gradient fill. Supports both a
 * **determinate** mode (a known `value` 0..1 → an inline-width fill) and an
 * **indeterminate** mode (omit `value` → a CSS-keyframe sweeping band) — plus
 * the catalog `variant` forms (PL-01…PL-16): title+%+sub rows, zone coloring,
 * step cells, milestone ticks, a ghost compare layer, an overflow badge, a
 * head pill riding the fill, and a right→left countdown drain.
 *
 * Distinct from `BarFill`, which is a static fraction fill only — `ProgressBar`
 * adds the indeterminate animation, an optional label / percentage, and tone.
 */
export function ProgressBar(props: ProgressBarProps) {
  if (props.variant) {
    return <VariantBar {...props} variant={props.variant} />;
  }

  const {
    value,
    height = 8,
    gradient = 'var(--grad-flux)',
    track = 'rgba(255,255,255,0.07)',
    label,
    showValue = false,
    rounded = true,
    className,
    style,
    // consume variant-only props so they don't leak onto the DOM node
    variant: _variant,
    color: _color,
    sub: _sub,
    steps: _steps,
    milestones: _milestones,
    ghost: _ghost,
    target: _target,
    shine: _shine,
    ...rest
  } = props;

  const indeterminate = value == null;
  const v = indeterminate ? 0 : Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);

  const rootStyle = {
    '--lk-pb-h': `${height}px`,
    '--lk-pb-fill': gradient,
    '--lk-pb-track': track,
    '--lk-pb-radius': rounded ? 'var(--r-pill)' : '0px',
    '--lk-pb-v': `${pct}%`,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn('lk-progressbar', indeterminate && 'is-indeterminate', className)}
      style={rootStyle}
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : pct}
      aria-label={label ?? (indeterminate ? 'Loading' : undefined)}
      {...rest}
    >
      {(label || showValue) && (
        <div className="lk-progressbar-meta">
          {label && <span className="lk-progressbar-label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="lk-progressbar-value">{pct}%</span>
          )}
        </div>
      )}
      <div className="lk-progressbar-track" aria-hidden="true">
        <i className="lk-progressbar-fill" />
      </div>
    </div>
  );
}

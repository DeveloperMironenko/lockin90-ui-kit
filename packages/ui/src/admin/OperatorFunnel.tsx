import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from '../components/Icon';

/* OperatorFunnel — operator conversion-funnel primitive (admin). A vertical
   stack of proportional horizontal bars (bar width ∝ count relative to the
   first/max step), each tier-coloured from the Aurora spectrum, with the step
   icon + label + sublabel and the count + conversion% rendered INSIDE the bar;
   a small drop-off pill sits between steps in a warn/bad tone. Mirrors the
   `.funnel` block from lockin90-design/admin/growth.html (onboarding funnel)
   and content.html (engagement). Web-only (admin has no native surface);
   pure render — no client hooks.

   Renamed from `FunnelChart` to avoid a name/type clash with the root
   `@lockin90/ui` chart `FunnelChart`; `admin/index.ts` keeps a deprecated
   `FunnelChart`/`FunnelChartProps` alias for back-compat. */

/** A single stage in the funnel (signup → verify → … → activated). */
export interface FunnelStep {
  /** Stable key for the row. */
  id: string;
  /** Stage name (e.g. "Verify email"). */
  label: string;
  /** Mono sub-line under the label (e.g. "6-digit code"). */
  sublabel?: string;
  /** Leading glyph from the shared icon set. */
  icon?: IconName;
  /** Absolute count reaching this stage. */
  count: number;
  /** Conversion vs the first step, as a percentage (0–100). */
  conversionPct: number;
  /** Drop-off from the previous step, as a percentage; omit on the first step. */
  dropPct?: number;
  /** Spectrum tier (0-based) → bar colour; defaults to the row index. */
  tier?: number;
}

export interface OperatorFunnelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Ordered stages, widest (first) → narrowest (last). */
  steps: FunnelStep[];
  /** Render the tier/threshold legend row below the funnel. @default false */
  legend?: boolean;
}

/* Aurora spectrum, ordered lime → magenta. Tier index maps into this; it
   wraps so any tier count renders. Driven by tokens (no hardcoded hex). */
const TIER_VARS = [
  'var(--lime)',
  'var(--mint)',
  'var(--cyan)',
  'var(--indigo)',
  'var(--violet)',
  'var(--magenta)',
] as const;

const tierColor = (tier: number): string => TIER_VARS[tier % TIER_VARS.length];

/** Format a count with thousands separators. */
const fmt = (n: number): string => n.toLocaleString('en-US');

/** Round to one decimal for percentage display. */
const pct = (n: number): string => `${n.toFixed(1)}%`;

export function OperatorFunnel({ steps, legend = false, className, ...rest }: OperatorFunnelProps) {
  // Bar width is proportional to count relative to the widest (first/max) step.
  const maxCount = steps.reduce((m, s) => Math.max(m, s.count), 0) || 1;

  return (
    <div className={cn('lk-funnel', className)} role="img" {...rest}>
      {steps.map((step, i) => {
        const tier = step.tier ?? i;
        const color = tierColor(tier);
        const width = `${Math.max(0, Math.min(100, (step.count / maxCount) * 100))}%`;
        const isFirst = i === 0;
        // Drop-off severity: >20pts is a "bad" intervention signal, else warn.
        const dropBad = (step.dropPct ?? 0) > 20;

        return (
          <div className="lk-funnel-step" key={step.id}>
            <div className="lk-funnel-label">
              {step.icon ? (
                <span className="lk-funnel-ico" style={{ color }}>
                  <Icon name={step.icon} size={16} />
                </span>
              ) : null}
              <div className="lk-funnel-id">
                <span className="lk-funnel-nm">{step.label}</span>
                {step.sublabel ? <span className="lk-funnel-st">{step.sublabel}</span> : null}
              </div>
            </div>

            <div className="lk-funnel-track">
              <div
                className="lk-funnel-fill"
                style={{ width, background: color }}
                aria-hidden="true"
              />
              <div className="lk-funnel-meta">
                <span className="lk-funnel-cnt">{fmt(step.count)}</span>
                <span className="lk-funnel-conv">{pct(step.conversionPct)}</span>
                {isFirst ? (
                  <span className="lk-funnel-drop lk-funnel-drop-base">— baseline</span>
                ) : step.dropPct != null ? (
                  <span
                    className={cn('lk-funnel-drop', {
                      'lk-funnel-drop-bad': dropBad,
                      'lk-funnel-drop-warn': !dropBad,
                    })}
                  >
                    −{pct(step.dropPct)}
                    {dropBad ? ' ▼' : ''}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {legend ? (
        <div className="lk-funnel-legend">
          <span className="lk-funnel-lg">
            <span className="lk-funnel-sw" style={{ background: 'var(--lime)' }} /> step tier (spectrum)
          </span>
          <span className="lk-funnel-lg">
            <span className="lk-funnel-sw" style={{ background: 'var(--warn)' }} /> drop-off, watch
          </span>
          <span className="lk-funnel-lg">
            <span className="lk-funnel-sw" style={{ background: 'var(--bad)' }} /> drop-off &gt; 20% (intervene)
          </span>
        </div>
      ) : null}
    </div>
  );
}

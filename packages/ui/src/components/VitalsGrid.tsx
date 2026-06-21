import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Built-in tone keys — drive the tile's icon color (mirrors the design example). */
export type VitalTone = 'hr' | 'hrv' | 'spo2' | 'resp' | 'temp' | 'bp';

/** Trend direction → arrow glyph + color band. */
export type VitalTrendKind = 'good' | 'bad' | 'warn' | 'flat';

/** A tiny trend line under the value, e.g. "▼ 2 · recovered". */
export interface VitalTrend {
  /** Arrow glyph, e.g. "▲" / "▼" / "–". Defaults per `kind`. */
  arrow?: string;
  /** Trend copy, e.g. "2 · recovered". */
  text: string;
  /** Color band of the trend. */
  kind?: VitalTrendKind;
}

/** A single biometric tile. */
export interface Vital {
  /** Mono uppercase label, e.g. "Resting HR". */
  label: string;
  /** Big display value, e.g. "52" or "118/76". */
  value: ReactNode;
  /** Mono unit suffix, e.g. "bpm". Hidden when omitted. */
  unit?: string;
  /** Tone key — tints the icon. Falls back to a neutral dim stroke. */
  tone?: VitalTone;
  /** Tile icon (svg). Defaults to the per-tone glyph (or a generic dot). */
  icon?: ReactNode;
  /** Trend line under the value. Hidden when omitted. */
  trend?: VitalTrend;
}

export interface VitalsGridProps extends HTMLAttributes<HTMLElement> {
  /** Mono eyebrow over the grid, e.g. "Vitals · this morning". Hidden when empty. */
  title?: string;
  /** Biometric tiles. */
  vitals?: Vital[];
  className?: string;
}

/** Default arrow glyph per trend kind. */
const TREND_ARROW: Record<VitalTrendKind, string> = {
  good: '▲',
  bad: '▼',
  warn: '▲',
  flat: '–',
};

const ICONS: Record<VitalTone, ReactNode> = {
  hr: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  hrv: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12h4l2-7 4 14 2-7h8" />
    </svg>
  ),
  spo2: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.7s7 6.4 7 11.3a7 7 0 0 1-14 0c0-4.9 7-11.3 7-11.3z" />
    </svg>
  ),
  resp: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 4-3 7-7 10z" />
      <path d="M9 11h6M12 8v6" />
    </svg>
  ),
  temp: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />
    </svg>
  ),
  bp: (
    <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

const GENERIC_ICON = (
  <svg className="lk-vit-ico" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const DEFAULT_VITALS: Vital[] = [
  { label: 'Resting HR', value: '52', unit: 'bpm', tone: 'hr', trend: { arrow: '▼', text: '2 · recovered', kind: 'good' } },
  { label: 'HRV', value: '68', unit: 'ms', tone: 'hrv', trend: { arrow: '▲', text: '5 · trending up', kind: 'good' } },
  { label: 'SpO₂', value: '98', unit: '%', tone: 'spo2', trend: { arrow: '–', text: 'steady', kind: 'flat' } },
  { label: 'Resp rate', value: '14', unit: '/min', tone: 'resp', trend: { arrow: '–', text: 'steady', kind: 'flat' } },
  { label: 'Skin temp', value: '+0.2', unit: '°C', tone: 'temp', trend: { arrow: '▲', text: 'slightly warm', kind: 'warn' } },
  { label: 'Blood pressure', value: '118/76', unit: 'mmHg', tone: 'bp', trend: { arrow: '–', text: 'normal', kind: 'flat' } },
];

/** Vitals grid — a compact auto-fill grid of biometric tiles (resting HR, HRV,
 *  SpO₂, resp rate, skin temp, blood pressure). Each tile carries a mono label,
 *  a tone-tinted icon, a big display value + mono unit, and a tiny color-coded
 *  trend arrow with delta copy. */
export function VitalsGrid({
  title = 'Vitals · this morning',
  vitals = DEFAULT_VITALS,
  className,
  ...rest
}: VitalsGridProps) {
  return (
    <section className={cn('lk-vit lk-card', className)} {...rest}>
      {title ? (
        <div className="lk-vit-head">
          <span className="lk-vit-eyebrow lk-mono">{title}</span>
          <span className="lk-vit-ln" />
        </div>
      ) : null}

      <div className="lk-vit-grid">
        {vitals.map((v, i) => {
          const kind = v.trend?.kind ?? 'flat';
          const arrow = v.trend?.arrow ?? TREND_ARROW[kind];
          const icon = v.icon ?? (v.tone ? ICONS[v.tone] : GENERIC_ICON);
          return (
            <article key={`${v.label}-${i}`} className="lk-vit-tile" data-tone={v.tone}>
              <div className="lk-vit-top">
                <span className="lk-vit-label">{v.label}</span>
                {icon}
              </div>
              <div className="lk-vit-val lk-display lk-tnum">
                <span className="lk-mono">{v.value}</span>
                {v.unit ? <span className="lk-vit-unit">{v.unit}</span> : null}
              </div>
              {v.trend ? (
                <span className={cn('lk-vit-trend', `is-${kind}`)}>
                  <span className="lk-vit-arrow">{arrow}</span>
                  {v.trend.text}
                </span>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

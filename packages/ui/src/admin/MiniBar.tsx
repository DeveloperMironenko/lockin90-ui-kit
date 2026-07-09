import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../cn';
import { Meter } from '../components/Meter';

/* MiniBar — a labelled proportion row: left label, a thin fill track (value/max), right
   caption. For breakdowns (per-plan MRR share, per-tier conversion, per-provider cost).
   The value/max fill track is now delegated to the canonical `Meter` (rendered in its
   track-only mode); MiniBar keeps its own row layout (label · bar · caption) and its
   7-tone fill palette (piped into Meter's `--fill`). Export + props kept for back-compat.
   Web-only. `lk-minibar*` classes. */

export type MiniBarTone = 'flux' | 'accent' | 'mint' | 'cyan' | 'warn' | 'bad' | 'neutral';

export interface MiniBarProps {
  /** Left-hand label, e.g. "PRO". */
  label: string;
  /** Filled amount. */
  value: number;
  /** Denominator for the fill width; fill = value/max (clamped 0..1). */
  max: number;
  /** Right-hand caption (mono), e.g. "3 · $29k". */
  caption?: ReactNode;
  /** Fill colour. `flux` = gradient (default). */
  tone?: MiniBarTone;
  className?: string;
}

const TONE_BG: Record<MiniBarTone, string> = {
  flux: 'var(--grad-flux)',
  accent: 'var(--accent)',
  mint: 'var(--mint)',
  cyan: 'var(--accent-2)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
  neutral: 'var(--text-faint)',
};

export function MiniBar({ label, value, max, caption, tone = 'flux', className }: MiniBarProps) {
  return (
    <div className={cn('lk-minibar', className)}>
      <span className="lk-minibar-label">{label}</span>
      <Meter
        className="lk-minibar-meter"
        value={value}
        min={0}
        max={max}
        tone="accent"
        aria-label={label}
        style={{ ['--fill']: TONE_BG[tone], ['--glow']: 'transparent' } as CSSProperties}
      />
      {caption != null && <span className="lk-minibar-caption">{caption}</span>}
    </div>
  );
}

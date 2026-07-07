import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../cn';

/* MiniBar — a labelled proportion row: left label, a thin fill track (value/max), right
   caption. For breakdowns (per-plan MRR share, per-tier conversion, per-provider cost). The
   fill is the flux gradient by default, or a solid tone. Web-only. `lk-minibar*` classes. */

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
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) * 100 : 0;
  return (
    <div className={cn('lk-minibar', className)}>
      <span className="lk-minibar-label">{label}</span>
      <span className="lk-minibar-track">
        <span className="lk-minibar-fill" style={{ width: `${pct}%`, background: TONE_BG[tone] } as CSSProperties} />
      </span>
      {caption != null && <span className="lk-minibar-caption">{caption}</span>}
    </div>
  );
}

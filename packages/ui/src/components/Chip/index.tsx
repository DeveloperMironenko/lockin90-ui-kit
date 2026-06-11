import type { ReactNode } from 'react';

export type ChipTone = 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface ChipProps {
  children: ReactNode;
  /** Signal tone — maps to the energy zone / accent colors. */
  tone?: ChipTone;
  /** Show a leading glowing dot in the current color. */
  dot?: boolean;
  className?: string;
}

const TONE: Record<ChipTone, { color: string; border: string; bg: string }> = {
  neutral: { color: 'var(--text-secondary)', border: 'var(--border)', bg: 'var(--glass)' },
  high: { color: 'var(--zone-high)', border: 'rgba(52,245,197,0.35)', bg: 'rgba(52,245,197,0.08)' },
  mid: { color: 'var(--zone-mid)', border: 'rgba(255,176,32,0.35)', bg: 'rgba(255,176,32,0.08)' },
  low: { color: 'var(--zone-low)', border: 'rgba(255,77,109,0.35)', bg: 'rgba(255,77,109,0.08)' },
  accent: { color: '#cbbcff', border: 'rgba(124,92,255,0.40)', bg: 'rgba(124,92,255,0.10)' },
};

/**
 * Aurora glass pill chip with an energy-zone signal color. Heavier than the
 * tiny <Badge> mono label — used for status pills, filters and meta tags.
 */
export default function Chip({ children, tone = 'neutral', dot = false, className = '' }: ChipProps) {
  const t = TONE[tone];
  return (
    <span
      className={`inline-flex items-center gap-[7px] font-mono text-[11px] font-medium tracking-[0.04em] px-[11px] py-[5px] rounded-full border ${className}`.trim()}
      style={{ color: t.color, borderColor: t.border, background: t.bg }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'currentColor', boxShadow: '0 0 8px currentColor' }}
        />
      )}
      {children}
    </span>
  );
}

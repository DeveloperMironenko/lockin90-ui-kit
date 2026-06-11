import { energyColor } from '@lockin90/tokens';

export interface CalendarDay {
  /** Day-of-week letter, e.g. "M". */
  label: string;
  /** Date number or short string. */
  date: string | number;
  /** Energy score 0..100. */
  value: number;
  /** Flag a low-energy day (coral marker). */
  low?: boolean;
  /** Highlight today (cyan ring + glow). */
  today?: boolean;
}

export interface CalendarStripProps {
  days: CalendarDay[];
  /** Mini-ring diameter in px. */
  size?: number;
  className?: string;
}

function MiniRing({ value, size, today }: { value: number; size: number; today?: boolean }) {
  const stroke = Math.max(3, Math.round(size * 0.11));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 100));
  const color = energyColor(value);
  return (
    <svg
      width={size}
      height={size}
      style={{
        transform: 'rotate(-90deg)',
        borderRadius: '50%',
        boxShadow: today ? '0 0 0 2px rgba(34,211,238,0.55)' : undefined,
      }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
      />
    </svg>
  );
}

/**
 * Horizontal strip of mini energy rings — one per day. Flags low days (coral
 * dot) and highlights today (cyan ring). Used for "last N days" calendars.
 */
export default function CalendarStrip({ days, size = 44, className = '' }: CalendarStripProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto ${className}`.trim()}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
            {d.label}
          </span>
          <div className="relative">
            <MiniRing value={d.value} size={size} today={d.today} />
            {d.low && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--zone-low)', boxShadow: '0 0 6px var(--zone-low)' }}
                aria-label="low energy"
              />
            )}
          </div>
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: d.today ? 'var(--accent-2)' : 'var(--text-secondary)' }}
          >
            {d.date}
          </span>
        </div>
      ))}
    </div>
  );
}

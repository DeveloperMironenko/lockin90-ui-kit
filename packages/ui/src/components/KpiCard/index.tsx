import type { ReactNode } from 'react';
import SparkLine from '../SparkLine';

export interface KpiCardProps {
  /** Eyebrow label, e.g. "RESTING HR". */
  label: string;
  /** Primary value (already formatted). */
  value: ReactNode;
  /** Small unit suffix, e.g. "bpm". */
  unit?: string;
  /** Signed change vs. baseline. */
  delta?: { value: string; direction: 'up' | 'down' };
  /** Optional sparkline series. */
  spark?: number[];
  /** Leading icon (inline SVG). */
  icon?: ReactNode;
  /** Add the gradient top hairline. */
  lit?: boolean;
  className?: string;
}

const ZONE_HIGH = '#34F5C5';
const ZONE_LOW = '#FF4D6D';

/** KPI stat tile: eyebrow label, big value, signed delta and an optional spark. */
export default function KpiCard({
  label,
  value,
  unit,
  delta,
  spark,
  icon,
  lit = false,
  className = '',
}: KpiCardProps) {
  const deltaColor = delta?.direction === 'down' ? ZONE_LOW : ZONE_HIGH;
  return (
    <div className={`ea-card ${lit ? 'ea-card-lit' : ''} ${className}`.trim()}>
      <div className="flex items-start justify-between gap-2">
        <span className="ea-stat-block-label">{label}</span>
        {icon && <span className="text-secondary shrink-0">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1 mt-2">
        <span className="ea-num text-white" style={{ fontSize: 30, lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span className="ea-stat-block-unit">{unit}</span>}
      </div>

      {delta && (
        <div className="font-mono text-[12px] mt-1.5 tabular-nums" style={{ color: deltaColor }}>
          {delta.direction === 'up' ? '↑' : '↓'} {delta.value}
        </div>
      )}

      {spark && spark.length > 1 && (
        <div className="mt-3">
          <SparkLine values={spark} width={240} height={40} color={delta?.direction === 'down' ? ZONE_LOW : '#7C5CFF'} className="block w-full" />
        </div>
      )}
    </div>
  );
}

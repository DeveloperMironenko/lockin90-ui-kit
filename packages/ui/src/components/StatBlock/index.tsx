import type { StatBlockProps } from './types';

export default function StatBlock({ label, value, unit }: StatBlockProps) {
  return (
    <div className="ea-stat-block">
      <div className="ea-stat-block-label">{label}</div>
      <div>
        <span className="ea-stat-block-value">{value}</span>
        {unit && <span className="ea-stat-block-unit">{unit}</span>}
      </div>
    </div>
  );
}

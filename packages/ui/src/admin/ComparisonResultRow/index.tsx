'use client';

import { Mono } from '../../components/Typography';
import StatusBadge from '../../components/StatusBadge';
import type { ComparisonResultRowProps } from './types';

const STATUS_TONE = {
  pending: 'neutral',
  running: 'amber',
  completed: 'green',
  failed: 'red',
} as const;

export default function ComparisonResultRow({ result, onClick }: ComparisonResultRowProps) {
  const stats = result.aggregateStats;
  const meanDelta = stats?.meanDelta ?? null;
  const maxAbs = stats?.maxAbsDelta ?? null;
  const tone =
    meanDelta == null
      ? 'text-secondary'
      : Math.abs(meanDelta) < 0.005
        ? 'text-secondary'
        : meanDelta > 0
          ? 'text-[#34F5C5]'
          : 'text-accent';

  return (
    <tr
      className="ea-table-row cursor-pointer"
      onClick={() => onClick?.(result)}
    >
      <td className="ea-table-td">
        <Mono color="white">{result.userId}</Mono>
      </td>
      <td className="ea-table-td">
        <Mono>
          {result.versionA} → {result.versionB}
        </Mono>
      </td>
      <td className="ea-table-td">
        <Mono>
          {result.intervalFrom.slice(0, 10)} … {result.intervalTo.slice(0, 10)}
        </Mono>
      </td>
      <td className="ea-table-td text-right">
        {meanDelta == null ? (
          <span className="text-muted">—</span>
        ) : (
          <span className={`font-mono text-[12px] tabular-nums ${tone}`}>
            {meanDelta > 0 ? '+' : ''}
            {meanDelta.toFixed(3)}
          </span>
        )}
      </td>
      <td className="ea-table-td text-right">
        {maxAbs == null ? (
          <span className="text-muted">—</span>
        ) : (
          <Mono color="white">{maxAbs.toFixed(3)}</Mono>
        )}
      </td>
      <td className="ea-table-td text-right">
        {stats ? <Mono color="white">{stats.nDays}</Mono> : <span className="text-muted">—</span>}
      </td>
      <td className="ea-table-td text-right">
        <StatusBadge tone={STATUS_TONE[result.status]}>{result.status}</StatusBadge>
      </td>
    </tr>
  );
}

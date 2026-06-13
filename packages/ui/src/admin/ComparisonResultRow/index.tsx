'use client';

import type { CSSProperties } from 'react';
import StatusBadge from '../../components/StatusBadge';
import type { StatusTone } from '../../components/StatusBadge';
import type { UserResultStatus, ComparisonResultRowProps } from './types';

// Job status → StatusBadge pulse tone. `running` reuses the warn (amber) pulse.
const STATUS_TONE: Record<UserResultStatus, StatusTone> = {
  pending: 'warn',
  running: 'warn',
  completed: 'ok',
  failed: 'bad',
};

const monoCell: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontFeatureSettings: "'tnum' 1",
  color: 'var(--text-dim)',
};

/**
 * A `<tr>` for an A/B comparison result table: user, version pair, interval,
 * mean delta (tinted), max abs delta, day count, and a live status badge.
 * Render inside an `lk-table`. Clickable when `onClick` is given.
 */
export default function ComparisonResultRow({ result, onClick }: ComparisonResultRowProps) {
  const stats = result.aggregateStats;
  const meanDelta = stats?.meanDelta ?? null;
  const maxAbs = stats?.maxAbsDelta ?? null;

  const deltaColor =
    meanDelta == null || Math.abs(meanDelta) < 0.005
      ? 'var(--text-dim)'
      : meanDelta > 0
        ? 'var(--ok)'
        : 'var(--accent)';

  return (
    <tr
      className="lk-comparison-row"
      onClick={onClick ? () => onClick(result) : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <td style={{ ...monoCell, color: 'var(--text)' }}>{result.userId}</td>
      <td style={monoCell}>
        {result.versionA} &rarr; {result.versionB}
      </td>
      <td style={monoCell}>
        {result.intervalFrom.slice(0, 10)} &hellip; {result.intervalTo.slice(0, 10)}
      </td>
      <td style={{ textAlign: 'right' }}>
        {meanDelta == null ? (
          <span style={{ color: 'var(--text-faint)' }}>&mdash;</span>
        ) : (
          <span style={{ ...monoCell, color: deltaColor }}>
            {meanDelta > 0 ? '+' : ''}
            {meanDelta.toFixed(3)}
          </span>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        {maxAbs == null ? (
          <span style={{ color: 'var(--text-faint)' }}>&mdash;</span>
        ) : (
          <span style={{ ...monoCell, color: 'var(--text)' }}>{maxAbs.toFixed(3)}</span>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        {stats ? (
          <span style={{ ...monoCell, color: 'var(--text)' }}>{stats.nDays}</span>
        ) : (
          <span style={{ color: 'var(--text-faint)' }}>&mdash;</span>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        <StatusBadge tone={STATUS_TONE[result.status]}>{result.status}</StatusBadge>
      </td>
    </tr>
  );
}

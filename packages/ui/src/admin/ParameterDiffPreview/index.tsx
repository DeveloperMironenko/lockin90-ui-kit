import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { ParamValue, ParameterDiffPreviewProps } from './types';

function isObject(v: ParamValue | undefined): v is Record<string, number | string | boolean> {
  return typeof v === 'object' && v !== null;
}

function renderScalar(v: number | string | boolean | undefined): string {
  if (v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : '—';
  return v;
}

function typeOf(v: ParamValue | undefined): string {
  if (v === undefined) return 'none';
  if (isObject(v)) return 'object';
  return typeof v;
}

const scalarStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--text)',
  fontVariantNumeric: 'tabular-nums',
  wordBreak: 'break-all',
};

/**
 * Side-by-side before/after preview for a parameter edit. Type-aware:
 *   - scalar values render in a single row
 *   - object values render row-per-key with mint (added) / red (removed) /
 *     amber (changed) chrome so the operator sees exactly what shifts.
 *
 * Aurora glass framing (lk-card) with a mono key·value grid. Admin-only
 * primitive (not mirrored to lockin90-frontend).
 */
export default function ParameterDiffPreview({
  family,
  paramKey,
  before,
  after,
  nextVersion,
  className,
}: ParameterDiffPreviewProps) {
  const beforeIsObj = isObject(before);
  const afterIsObj = isObject(after);
  const showObject = beforeIsObj || afterIsObj;

  return (
    <div
      className={cn('lk-card', 'lk-pdiff', className)}
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <div
        className="lk-pdiff-head"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '8px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--glass)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--text)' }}>
            {family}.{paramKey}
          </span>
        </span>
        {typeof nextVersion === 'number' && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
            will create version {nextVersion}
          </span>
        )}
      </div>

      <div className="lk-pdiff-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: 16 }}>
          <div className="lk-eyebrow" style={{ marginBottom: 4, color: 'var(--text-faint)' }}>
            Before
          </div>
          <div
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginBottom: 8 }}
          >
            type: {typeOf(before)}
          </div>
          {showObject ? (
            <ObjectPane
              value={beforeIsObj ? before : undefined}
              other={afterIsObj ? after : undefined}
              side="before"
            />
          ) : (
            <div style={scalarStyle}>
              {renderScalar(before as number | string | boolean | undefined)}
            </div>
          )}
        </div>
        <div style={{ padding: 16, borderLeft: '1px solid var(--border)' }}>
          <div className="lk-eyebrow" style={{ marginBottom: 4, color: 'var(--accent)' }}>
            After
          </div>
          <div
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginBottom: 8 }}
          >
            type: {typeOf(after)}
          </div>
          {showObject ? (
            <ObjectPane
              value={afterIsObj ? after : undefined}
              other={beforeIsObj ? before : undefined}
              side="after"
            />
          ) : (
            <div style={scalarStyle}>
              {renderScalar(after as number | string | boolean | undefined)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ObjectPaneProps {
  value: Record<string, number | string | boolean> | undefined;
  other: Record<string, number | string | boolean> | undefined;
  side: 'before' | 'after';
}

function ObjectPane({ value, other, side }: ObjectPaneProps) {
  const keys = new Set<string>();
  if (value) for (const k of Object.keys(value)) keys.add(k);
  if (other) for (const k of Object.keys(other)) keys.add(k);
  const sorted = Array.from(keys).sort();

  if (sorted.length === 0) {
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>—</div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {sorted.map((k) => {
        const here = value?.[k];
        const there = other?.[k];
        const inHere = here !== undefined;
        const inThere = there !== undefined;
        const changed = inHere && inThere && here !== there;
        const added = side === 'after' && inHere && !inThere;
        const removed = side === 'before' && inHere && !inThere;
        const tone = added
          ? 'var(--zone-high)'
          : removed
            ? 'var(--bad)'
            : changed
              ? 'var(--zone-mid)'
              : 'var(--text)';
        return (
          <div
            key={k}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}
          >
            <span style={{ color: 'var(--text-faint)', flex: '0 0 auto' }}>{k}</span>
            <span
              style={{ color: tone, fontVariantNumeric: 'tabular-nums', wordBreak: 'break-all' }}
            >
              {inHere ? renderScalar(here) : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

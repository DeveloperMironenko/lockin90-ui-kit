import type { ParamValue } from '../_vendor-types';
import type { ParameterDiffPreviewProps } from './types';

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

/**
 * Side-by-side before/after preview for a parameter edit. Type-aware:
 *   - scalar values render in a single row
 *   - object values render row-per-key with green (added) / red (removed) /
 *     amber (changed) chrome so the operator sees exactly what shifts.
 *
 * Admin-only primitive (not mirrored to lockin90-frontend).
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
    <div className={`border border-border rounded ${className ?? ''}`}>
      <div className="flex items-center justify-between border-b border-border bg-elevated/40 px-4 py-2">
        <div className="font-mono text-[11px] text-secondary">
          <span className="text-white">{family}.{paramKey}</span>
        </div>
        {typeof nextVersion === 'number' && (
          <div className="font-mono text-[11px] text-accent">
            will create version {nextVersion}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-4">
          <div className="ea-eyebrow text-muted mb-1">BEFORE</div>
          <div className="font-mono text-[11px] text-muted mb-2">type: {typeOf(before)}</div>
          {showObject ? (
            <ObjectPane value={beforeIsObj ? before : undefined} other={afterIsObj ? after : undefined} side="before" />
          ) : (
            <div className="font-mono text-[12px] text-white tabular-nums break-all">
              {renderScalar(before as number | string | boolean | undefined)}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="ea-eyebrow text-accent mb-1">AFTER</div>
          <div className="font-mono text-[11px] text-muted mb-2">type: {typeOf(after)}</div>
          {showObject ? (
            <ObjectPane value={afterIsObj ? after : undefined} other={beforeIsObj ? before : undefined} side="after" />
          ) : (
            <div className="font-mono text-[12px] text-white tabular-nums break-all">
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
    return <div className="font-mono text-[11px] text-muted">—</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {sorted.map(k => {
        const here = value?.[k];
        const there = other?.[k];
        const inHere = here !== undefined;
        const inThere = there !== undefined;
        const changed = inHere && inThere && here !== there;
        const added = side === 'after' && inHere && !inThere;
        const removed = side === 'before' && inHere && !inThere;
        const tone = added
          ? 'text-[#3FB661]'
          : removed
          ? 'text-accent'
          : changed
          ? 'text-[#F0A93B]'
          : 'text-white';
        return (
          <div key={k} className="flex items-baseline gap-2 font-mono text-[11px]">
            <span className="text-muted shrink-0">{k}</span>
            <span className={`tabular-nums break-all ${tone}`}>
              {inHere ? renderScalar(here) : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

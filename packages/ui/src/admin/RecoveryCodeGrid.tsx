import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* RecoveryCodeGrid — a read-only grid of masked MFA recovery (backup) codes for
   the operator console. Each cell shows a 1-based index + the masked code in
   mono; `used` codes are struck-through and dimmed. An optional header shows how
   many codes remain unused. Pure render (no state) — generation / regeneration
   is owned by the caller. Web-only (admin has no native surface). Matches the
   `.rec-grid` / `.rec-code` block from lockin90-design/admin/settings.html. */

export interface RecoveryCodeGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The recovery codes, in order. `masked` is the display string
   *  (e.g. `'7•••-•••2'`); `used` strikes the code through. */
  codes: { masked: string; used?: boolean }[];
  /** Remaining unused count for the header chip (e.g. `8 of 10 unused`).
   *  Omit to hide the header. */
  unusedCount?: number;
  /** Number of grid columns. Default `2` (matches the design). */
  columns?: number;
}

/** Zero-pad a 1-based index to 2 digits (01, 02, … 10). */
const padIndex = (n: number) => String(n).padStart(2, '0');

export function RecoveryCodeGrid({
  codes,
  unusedCount,
  columns = 2,
  className,
  style,
  ...rest
}: RecoveryCodeGridProps) {
  const total = codes.length;
  const showHeader = unusedCount != null;

  return (
    <div className={cn('lk-reccodes', className)} {...rest}>
      {showHeader && (
        <div className="lk-reccodes-head">
          <span className="lk-reccodes-title">Recovery codes</span>
          <span className="lk-reccodes-count">
            {unusedCount} of {total} unused
          </span>
        </div>
      )}

      <div
        className="lk-reccodes-grid"
        role="list"
        aria-label="Recovery codes"
        style={
          {
            ['--lk-reccodes-cols']: columns,
            ...style,
          } as CSSProperties
        }
      >
        {codes.map((code, i) => (
          <div
            key={i}
            role="listitem"
            className={cn('lk-reccode', code.used && 'lk-reccode-used')}
            aria-label={`Code ${padIndex(i + 1)}${code.used ? ', used' : ''}`}
          >
            <span className="lk-reccode-ix" aria-hidden="true">
              {padIndex(i + 1)}
            </span>
            <span className="lk-reccode-val">{code.masked}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

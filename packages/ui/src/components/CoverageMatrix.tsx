import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** State of a single source × metric cell:
 *  - `on`  — source is the primary provider for that metric (filled check)
 *  - `alt` — source can provide it as a secondary / fallback (ring)
 *  - `off` / `' '` — source does not provide that metric (dash) */
export type CoverageCell = 'on' | 'alt' | 'off' | ' ';

export interface CoverageMatrixProps extends HTMLAttributes<HTMLDivElement> {
  /** card title */
  title?: string;
  /** mono summary line; defaults to "<sources> sources · <metrics> metrics" */
  subtitle?: string;
  /** row labels — the integration sources */
  sources?: string[];
  /** column labels — the metrics */
  metrics?: string[];
  /**
   * Coverage states as a grid, one row per source, one entry per metric.
   * Missing rows/cells fall back to `off`. `' '` is treated as `off`.
   */
  cells?: CoverageCell[][];
  /** show the Primary / Secondary / Not-provided legend */
  legend?: boolean;
}

/** Faithful reproduction of the design's "Data coverage" example. */
const DEFAULT_SOURCES = ['Oura', 'WHOOP', 'Apple Health', 'Manual'];
const DEFAULT_METRICS = ['Sleep', 'HRV', 'Steps', 'Workouts', 'Heart', 'Temp'];
const DEFAULT_CELLS: CoverageCell[][] = [
  ['on', 'on', 'off', 'off', 'alt', 'on'], // Oura
  ['alt', 'on', 'off', 'on', 'on', 'off'], // WHOOP
  ['off', 'off', 'on', 'alt', 'alt', 'off'], // Apple Health
  ['off', 'off', 'alt', 'alt', 'off', 'off'], // Manual
];

const CHECK_PATH = 'M2 6.5L5 9.5L10 3';

/** normalize a possibly-missing cell to a concrete state */
function cellAt(cells: CoverageCell[][], row: number, col: number): Exclude<CoverageCell, ' '> {
  const v = cells[row]?.[col];
  if (v === 'on' || v === 'alt') return v;
  return 'off';
}

/** A single coverage dot — filled check (on), ring (alt) or dash (off). */
function CoverageDot({ state }: { state: Exclude<CoverageCell, ' '> }) {
  if (state === 'on') {
    return (
      <span className="lk-cov-dot lk-cov-on" role="img" aria-label="Primary">
        <svg className="lk-cov-ck" viewBox="0 0 12 12" aria-hidden="true">
          <path d={CHECK_PATH} />
        </svg>
      </span>
    );
  }
  if (state === 'alt') {
    return <span className="lk-cov-dot lk-cov-alt" role="img" aria-label="Secondary" />;
  }
  return <span className="lk-cov-dot lk-cov-off" role="img" aria-label="Not provided" />;
}

/** Coverage matrix — a sources × metrics grid showing which integration source
 *  provides which metric, with on / alternate / off cell states and a legend. */
export function CoverageMatrix({
  title = 'Data coverage',
  subtitle,
  sources = DEFAULT_SOURCES,
  metrics = DEFAULT_METRICS,
  cells = DEFAULT_CELLS,
  legend = true,
  className,
  ...rest
}: CoverageMatrixProps) {
  const sub = subtitle ?? `${sources.length} sources · ${metrics.length} metrics`;

  return (
    <div className={cn('lk-cov', 'lk-card', className)} {...rest}>
      <div className="lk-cov-head">
        <span className="lk-cov-title lk-display">{title}</span>
        <span className="lk-cov-sub lk-mono">{sub}</span>
      </div>

      <div className="lk-cov-scroll">
        <table className="lk-cov-table" aria-label="Coverage matrix: metrics by source">
          <thead>
            <tr>
              <th scope="col">Source</th>
              {metrics.map((m) => (
                <th key={m} scope="col">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((source, row) => (
              <tr key={source}>
                <td>
                  <span className="lk-cov-src">
                    <span className="lk-cov-mk" aria-hidden="true" />
                    {source}
                  </span>
                </td>
                {metrics.map((m, col) => (
                  <td key={m}>
                    <CoverageDot state={cellAt(cells, row, col)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {legend && (
        <div className="lk-cov-legend">
          <span>
            <CoverageDot state="on" /> Primary
          </span>
          <span>
            <CoverageDot state="alt" /> Secondary
          </span>
          <span>
            <CoverageDot state="off" /> Not provided
          </span>
        </div>
      )}
    </div>
  );
}

export type { CoverageCell as CoverageMatrixCell };

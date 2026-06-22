import { type ReactNode, type TableHTMLAttributes } from 'react';
import { cn } from '../cn';

export interface TableColumn {
  /** Key looked up on each row to read the cell value. */
  key: string;
  /** Column header label (rendered mono uppercase). */
  header: string;
  /** Horizontal alignment for the header + cells. Default 'left'. */
  align?: 'left' | 'right' | 'center';
  /** Optional fixed column width (e.g. '120px', '20%'). */
  width?: string;
  /** Render this column's cells in the mono font with tabular numerals. */
  mono?: boolean;
  /** Make this header clickable to sort by `key`. Pair with the Table sort props. */
  sortable?: boolean;
}

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Column definitions. Defaults to a small billing sample. */
  columns?: TableColumn[];
  /** Row data — each cell value is read as `row[col.key]`. Defaults to a sample. */
  rows?: Record<string, ReactNode>[];
  /** Fired when a body row is clicked; also makes rows keyboard-activatable. */
  onRowClick?: (row: Record<string, ReactNode>, index: number) => void;
  /** Tighter vertical padding for data-dense admin tables. */
  dense?: boolean;
  /** Key of the currently-sorted column — that header brightens + shows its direction. */
  sortKey?: string;
  /** Sort direction of the active column. Default 'asc'. */
  sortDir?: 'asc' | 'desc';
  /** Fired with a sortable column's `key` when its header is clicked. */
  onSort?: (key: string) => void;
}

/** Sort indicator glyph next to a sortable header: a neutral up/down chevron pair
 *  (↕) when the column isn't the active sort, a single up/down chevron when it is. */
function SortIcon({ state }: { state: 'none' | 'asc' | 'desc' }) {
  return (
    <svg
      className={cn('lk-table-sort-icon', state !== 'none' && 'lk-table-sort-active')}
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {state !== 'desc' && <path d="M7 10l5-5 5 5" />}
      {state !== 'asc' && <path d="M7 14l5 5 5-5" />}
    </svg>
  );
}

const DEFAULT_COLUMNS: TableColumn[] = [
  { key: 'name', header: 'User' },
  { key: 'plan', header: 'Plan' },
  { key: 'mrr', header: 'MRR', align: 'right', mono: true },
  { key: 'status', header: 'Status' },
];

const DEFAULT_ROWS: Record<string, ReactNode>[] = [
  { name: 'Ava Mitchell', plan: 'Pro', mrr: '$29.00', status: 'Active' },
  { name: 'Liam Carter', plan: 'Team', mrr: '$99.00', status: 'Active' },
  { name: 'Noah Bennett', plan: 'Pro', mrr: '$29.00', status: 'Trialing' },
  { name: 'Emma Reyes', plan: 'Free', mrr: '$0.00', status: 'Churned' },
];

/** Glass data table — sticky mono-uppercase header, hairline-separated rows that
 *  light up on hover, optional mono/tabular numeric columns and a dense mode.
 *  The base atom for admin + CMS lists. */
export function Table({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  onRowClick,
  dense,
  sortKey,
  sortDir = 'asc',
  onSort,
  className,
  ...rest
}: TableProps) {
  const clickable = typeof onRowClick === 'function';

  return (
    <table className={cn('lk-table', dense && 'lk-table-dense', className)} {...rest}>
      <thead className="lk-table-head">
        <tr>
          {columns.map((col) => {
            const isActive = sortKey === col.key;
            const sortable = Boolean(col.sortable) && typeof onSort === 'function';
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={
                  col.sortable
                    ? isActive
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
                className={cn(
                  'lk-table-th',
                  col.align === 'right' && 'lk-table-right',
                  col.align === 'center' && 'lk-table-center',
                  isActive && 'lk-table-th-active',
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {sortable ? (
                  <button
                    type="button"
                    className="lk-table-sort"
                    onClick={() => onSort!(col.key)}
                  >
                    <span>{col.header}</span>
                    <SortIcon state={isActive ? sortDir : 'none'} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="lk-table-body">
        {rows.map((row, i) => (
          <tr
            key={i}
            className={cn('lk-table-row', clickable && 'lk-table-clickable')}
            onClick={clickable ? () => onRowClick!(row, i) : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRowClick!(row, i);
                    }
                  }
                : undefined
            }
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={cn(
                  'lk-table-td',
                  col.mono && 'lk-table-mono',
                  col.align === 'right' && 'lk-table-right',
                  col.align === 'center' && 'lk-table-center',
                )}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

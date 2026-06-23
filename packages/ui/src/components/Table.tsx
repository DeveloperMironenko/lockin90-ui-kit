'use client';

import {
  Fragment,
  type ReactNode,
  type TableHTMLAttributes,
  useState,
} from 'react';
import { cn } from '../cn';
import { Checkbox } from './Checkbox';

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
  /** Show a leading checkbox column with a select-all header checkbox. */
  selectable?: boolean;
  /** Stable key per row used for selection. Defaults to the row index as a string. */
  rowKey?: (row: Record<string, ReactNode>, index: number) => string;
  /** Controlled set of selected row keys. */
  selectedKeys?: string[];
  /** Fired with the next set of selected row keys when selection changes. */
  onSelectionChange?: (keys: string[]) => void;
  /**
   * Per-row status tint. Return `'ok' | 'warn' | 'danger'` to give a row a subtle
   * left-border + gradient tint (mint / amber / rose), or `undefined` for none.
   * If omitted, the row's own `_tone` field is read as a fallback. Tints are purely
   * decorative and don't change layout.
   */
  rowTone?: (
    row: Record<string, ReactNode>,
    index: number,
  ) => 'ok' | 'warn' | 'danger' | undefined;
  /** Enable the expandable-detail-row affordance — adds a leading chevron column. */
  expandable?: boolean;
  /** Renders the full-width detail panel shown beneath an expanded row. */
  renderDetail?: (row: Record<string, ReactNode>, index: number) => ReactNode;
  /** Controlled set of expanded row keys (uses the same `rowKey` accessor). */
  expandedKeys?: (string | number)[];
  /** Fired with the next set of expanded row keys when an expand toggle changes. */
  onExpandedChange?: (keys: (string | number)[]) => void;
}

/** Chevron toggle for an expandable row — rotates down→up when its row is open. */
function ExpandIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn('lk-table-expand-icon', open && 'lk-table-expand-open')}
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
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
  selectable = false,
  rowKey = (_row, i) => String(i),
  selectedKeys,
  onSelectionChange,
  rowTone,
  expandable = false,
  renderDetail,
  expandedKeys,
  onExpandedChange,
  className,
  ...rest
}: TableProps) {
  const clickable = typeof onRowClick === 'function';

  // Expansion bookkeeping — controlled via `expandedKeys`/`onExpandedChange`, else
  // an internal set. Only meaningful when `expandable` is on. The chevron column is
  // added when `expandable` is set regardless of whether a `renderDetail` is given.
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>([]);
  const expandedControlled = expandedKeys !== undefined;
  const expanded = new Set(expandedControlled ? expandedKeys : internalExpanded);

  const toggleExpanded = (key: string | number) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    const arr = [...next];
    if (!expandedControlled) setInternalExpanded(arr);
    onExpandedChange?.(arr);
  };

  // Selection bookkeeping — only meaningful when `selectable` is on.
  const selected = new Set(selectedKeys ?? []);
  const allKeys = selectable ? rows.map((row, i) => rowKey(row, i)) : [];
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = allKeys.some((k) => selected.has(k));

  const toggleRow = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange?.([...next]);
  };

  const toggleAll = () => {
    onSelectionChange?.(allSelected ? [] : allKeys);
  };

  return (
    <table className={cn('lk-table', dense && 'lk-table-dense', className)} {...rest}>
      <thead className="lk-table-head">
        <tr>
          {expandable && (
            <th
              scope="col"
              className="lk-table-th lk-table-expand-cell"
              style={{ width: '1%' }}
              aria-label="Expand row"
            />
          )}
          {selectable && (
            <th
              scope="col"
              className="lk-table-th lk-table-select"
              style={{ width: '1%' }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
              />
            </th>
          )}
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
        {rows.map((row, i) => {
          const key = selectable ? rowKey(row, i) : undefined;
          const isSelected = key != null && selected.has(key);
          // Tone: explicit `rowTone` accessor wins, else the row's own `_tone` field.
          const tone =
            rowTone?.(row, i) ??
            (row._tone as 'ok' | 'warn' | 'danger' | undefined);
          // Expansion uses the same `rowKey` accessor so keys stay consistent with
          // selection; it's evaluated independently of `selectable`.
          const expandKey = expandable ? rowKey(row, i) : undefined;
          const isExpanded = expandKey != null && expanded.has(expandKey);
          const colSpan =
            columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
          return (
          <Fragment key={i}>
          <tr
            className={cn(
              'lk-table-row',
              clickable && 'lk-table-clickable',
              isSelected && 'lk-table-row-selected',
              tone === 'ok' && 'lk-table-row-ok',
              tone === 'warn' && 'lk-table-row-warn',
              tone === 'danger' && 'lk-table-row-danger',
              isExpanded && 'lk-table-row-expanded',
            )}
            aria-selected={selectable ? isSelected : undefined}
            aria-expanded={expandable ? isExpanded : undefined}
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
            {expandable && (
              // Stop propagation so toggling expansion never fires onRowClick.
              <td
                className="lk-table-td lk-table-expand-cell"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="lk-table-expand-btn"
                  aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(expandKey!)}
                >
                  <ExpandIcon open={isExpanded} />
                </button>
              </td>
            )}
            {selectable && (
              // Stop propagation so toggling a row checkbox never triggers onRowClick
              // (both the click and the keyboard Space/Enter that activate the box).
              <td
                className="lk-table-td lk-table-select"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleRow(key!)}
                  aria-label="Select row"
                />
              </td>
            )}
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
          {expandable && isExpanded && renderDetail && (
            <tr className="lk-table-detail-row">
              <td className="lk-table-detail-cell" colSpan={colSpan}>
                <div className="lk-table-detail-inner">{renderDetail(row, i)}</div>
              </td>
            </tr>
          )}
          </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

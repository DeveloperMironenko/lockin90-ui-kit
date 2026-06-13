'use client';

import { cn } from '../../cn';
import Checkbox from '../../components/Checkbox';
import type { DataTableProps } from './types';

/**
 * Aurora generic data table — sortable-ready, selectable, glass-chromed.
 *
 * The table owns no data shape: every cell flows through its column's `render`,
 * and selection is fully controlled via `selected` + `onToggleSelect`. Glass
 * header, hairline rows, hover lift and a gradient selected-state come from the
 * `lk-table*` class layer (see ./styles.css); dynamic widths/aligns are inline.
 */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  empty,
  loading = false,
  loadingRows = 8,
  className,
}: DataTableProps<T>) {
  const selectable = !!onToggleSelect;
  const allSelected =
    selectable && !!selected && rows.length > 0 && rows.every((r) => selected.has(rowKey(r)));
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn('lk-table-wrap', className)}>
      <table className="lk-table">
        <thead className="lk-table-head">
          <tr>
            {selectable && (
              <th className="lk-table-th lk-table-th-check">
                <Checkbox
                  checked={!!allSelected}
                  onChange={() => onToggleSelectAll?.()}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('lk-table-th', `lk-align-${col.align ?? 'left'}`)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={`skel-${i}`} className="lk-table-row lk-table-row-skel">
                {selectable && (
                  <td className="lk-table-td">
                    <span className="lk-skel lk-skel-box" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="lk-table-td">
                    <span
                      className="lk-skel lk-skel-line"
                      style={{ width: `${40 + ((i * 7) % 50)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="lk-table-empty">
                {empty ?? <span className="lk-table-empty-text">No results</span>}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const isSelected = selected?.has(key) ?? false;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'lk-table-row',
                    onRowClick && 'lk-table-row-clickable',
                    isSelected && 'lk-table-row-selected',
                  )}
                >
                  {selectable && (
                    <td className="lk-table-td" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect?.(key)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'lk-table-td',
                        `lk-align-${col.align ?? 'left'}`,
                        col.mono && 'lk-table-td-mono',
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

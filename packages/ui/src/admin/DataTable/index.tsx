'use client';

import type { DataTableProps } from './types';

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
  const allSelected = selectable && selected && rows.length > 0 && rows.every(r => selected.has(rowKey(r)));

  return (
    <div className={`ea-table-wrap ${className ?? ''}`}>
      <table className="ea-table">
        <thead>
          <tr>
            {selectable && (
              <th className="w-8 ea-table-th">
                <input
                  type="checkbox"
                  checked={!!allSelected}
                  onChange={() => onToggleSelectAll?.()}
                  className="ea-checkbox"
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={`ea-table-th text-${col.align ?? 'left'}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={`skel-${i}`} className="ea-table-row">
                  {selectable && <td className="ea-table-td"><div className="h-4 w-4 bg-elevated rounded-sm" /></td>}
                  {columns.map(col => (
                    <td key={col.key} className="ea-table-td">
                      <div className="h-3 bg-elevated rounded-sm" style={{ width: `${40 + (i * 7) % 50}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.length === 0
            ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                  {empty ?? <span className="text-muted text-sm">No results</span>}
                </td>
              </tr>
            )
            : rows.map(row => {
                const key = rowKey(row);
                const isSelected = selected?.has(key) ?? false;
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={`ea-table-row ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'ea-table-row-selected' : ''}`}
                  >
                    {selectable && (
                      <td className="ea-table-td" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect?.(key)}
                          className="ea-checkbox"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={`ea-table-td text-${col.align ?? 'left'} ${col.mono ? 'font-mono text-[11px]' : ''}`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

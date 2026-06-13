import type { ReactNode } from 'react';

/**
 * A single column descriptor for {@link DataTable}.
 *
 * `render` is the only required field besides `key`/`header` — the table is fully
 * generic over the row type `T` and never reaches into row fields itself, so each
 * column decides how to project its row into a cell.
 */
export interface DataTableColumn<T> {
  /** Stable, unique column id (also used as the React key for header/cells). */
  key: string;
  /** Column heading text shown in the glass header row. */
  header: string;
  /** Fixed column width (any CSS length, e.g. `'120px'` or `'12rem'`). */
  width?: string;
  /** Horizontal alignment of the header + cells. Defaults to `'left'`. */
  align?: 'left' | 'right' | 'center';
  /** Render the cell in the mono (tabular) type ramp — for ids, counts, codes. */
  mono?: boolean;
  /** Project a row into the cell content. */
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  /** Column descriptors, left-to-right. */
  columns: DataTableColumn<T>[];
  /** The rows to render. */
  rows: T[];
  /** Derive a stable key for a row (used for React keys + selection membership). */
  rowKey: (row: T) => string | number;
  /** Fired when a row body is clicked (the row gets a pointer cursor + hover). */
  onRowClick?: (row: T) => void;
  /**
   * Controlled selection set. Presence of `onToggleSelect` is what turns the
   * leading checkbox column on; this set holds the currently-selected row keys.
   */
  selected?: Set<string | number>;
  /** Toggle a single row's selection. Providing this enables the checkbox column. */
  onToggleSelect?: (key: string | number) => void;
  /** Toggle select-all (header checkbox). */
  onToggleSelectAll?: () => void;
  /** Node shown when there are no rows and not loading. Defaults to "No results". */
  empty?: ReactNode;
  /** Render shimmer skeleton rows instead of data. */
  loading?: boolean;
  /** How many skeleton rows to render while `loading`. Defaults to 8. */
  loadingRows?: number;
  className?: string;
}

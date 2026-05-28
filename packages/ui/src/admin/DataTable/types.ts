import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  selected?: Set<string | number>;
  onToggleSelect?: (key: string | number) => void;
  onToggleSelectAll?: () => void;
  empty?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
  className?: string;
}

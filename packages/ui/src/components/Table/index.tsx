'use client';

import type { ReactNode, ThHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '../../cn';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

/** Aurora data table. Compose with the exported `Th` / standard thead/tbody/tr/td. */
export default function Table({ children, className, ...rest }: TableProps) {
  return (
    <table className={cn('lk-table', className)} {...rest}>
      {children}
    </table>
  );
}

export interface ThProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onClick'> {
  /** Make the header sortable (cursor + click). */
  sortable?: boolean;
  /** Current sort direction when this column is the active sort. */
  sort?: 'asc' | 'desc' | null;
  onSort?: () => void;
  children: ReactNode;
}

/** A header cell with optional sort affordance + indicator. */
export function Th({ sortable, sort, onSort, children, className, ...rest }: ThProps) {
  return (
    <th
      className={cn(sortable && 'lk-sortable', sort && 'lk-sorted', className)}
      onClick={sortable ? onSort : undefined}
      aria-sort={sort ? (sort === 'asc' ? 'ascending' : 'descending') : undefined}
      {...rest}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {children}
        {sort && <span aria-hidden="true">{sort === 'asc' ? '▲' : '▼'}</span>}
      </span>
    </th>
  );
}

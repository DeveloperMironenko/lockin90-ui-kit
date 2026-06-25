import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table, type TableColumn } from '../components/Table';

const meta = {
  title: 'Primitives/Table',
  component: Table,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Dense: StoryObj<typeof meta> = { args: { dense: true } };

const SORTABLE_COLUMNS: TableColumn[] = [
  { key: 'name', header: 'User', sortable: true },
  { key: 'plan', header: 'Plan' },
  { key: 'mrr', header: 'MRR', align: 'right', mono: true, sortable: true },
  { key: 'status', header: 'Status' },
];

const ROWS: Record<string, string>[] = [
  { name: 'Ava Mitchell', plan: 'Pro', mrr: '$29.00', status: 'Active' },
  { name: 'Liam Carter', plan: 'Team', mrr: '$99.00', status: 'Active' },
  { name: 'Noah Bennett', plan: 'Pro', mrr: '$29.00', status: 'Trialing' },
  { name: 'Emma Reyes', plan: 'Free', mrr: '$0.00', status: 'Churned' },
];

/** Sortable headers — the active column brightens and shows an up/down chevron;
 *  inactive sortable columns show the neutral ↕ pair. Click a header to toggle. */
export const Sortable: StoryObj<typeof meta> = {
  render: () => {
    const [sortKey, setSortKey] = useState('mrr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const onSort = (key: string) => {
      if (key === sortKey) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    };

    return (
      <Table
        columns={SORTABLE_COLUMNS}
        rows={ROWS}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
      />
    );
  },
};

/** Row selection — a leading checkbox column with a select-all header (checked when
 *  all rows are selected, indeterminate when only some are). Selection is controlled
 *  via `selectedKeys` + `onSelectionChange`; toggling a row checkbox never fires
 *  `onRowClick`. */
export const Selectable: StoryObj<typeof meta> = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['Liam Carter']);

    return (
      <Table
        columns={SORTABLE_COLUMNS}
        rows={ROWS}
        selectable
        rowKey={(row) => String(row.name)}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowClick={(row) => {
          // eslint-disable-next-line no-console
          console.log('row clicked', row.name);
        }}
      />
    );
  },
};

/** Per-row tone tints — pass `rowTone` to flag rows `ok` / `warn` / `danger`. Each
 *  flagged row gets a subtle status wash (mint / amber / rose) plus a left accent bar,
 *  mirroring the admin "legal hold" + refund-flag treatments. Tints are decorative —
 *  no layout shift, and the hover glass still reads on top. (A row's own `_tone`
 *  field is read as a fallback when `rowTone` isn't given.) */
export const RowTones: StoryObj<typeof meta> = {
  render: () => (
    <Table
      columns={SORTABLE_COLUMNS}
      rows={ROWS}
      rowTone={(row) => {
        if (row.status === 'Churned') return 'danger';
        if (row.status === 'Trialing') return 'warn';
        if (row.status === 'Active') return 'ok';
        return undefined;
      }}
    />
  ),
};

/** Expandable detail rows — set `expandable` + `renderDetail` to add a leading chevron
 *  that toggles a full-width detail panel beneath each row. Uncontrolled here (internal
 *  state); pass `expandedKeys` + `onExpandedChange` to drive it from the outside. The
 *  chevron flips up→down and never fires `onRowClick`. */
export const Expandable: StoryObj<typeof meta> = {
  render: () => (
    <Table
      columns={SORTABLE_COLUMNS}
      rows={ROWS}
      expandable
      rowKey={(row) => String(row.name)}
      renderDetail={(row) => (
        <div style={{ display: 'grid', gap: 6, fontSize: 12 }}>
          <div>
            <strong>{String(row.name)}</strong> — {String(row.plan)} plan
          </div>
          <div>Monthly recurring revenue: {String(row.mrr)}</div>
          <div>Account status: {String(row.status)}</div>
        </div>
      )}
    />
  ),
};

/** Controlled expansion + tones together — `expandedKeys`/`onExpandedChange` drive the
 *  open rows while `rowTone` flags them, showing the two additive capabilities compose. */
export const ExpandableControlled: StoryObj<typeof meta> = {
  render: () => {
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([
      'Emma Reyes',
    ]);

    return (
      <Table
        columns={SORTABLE_COLUMNS}
        rows={ROWS}
        expandable
        rowKey={(row) => String(row.name)}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        rowTone={(row) => (row.status === 'Churned' ? 'danger' : undefined)}
        renderDetail={(row) => (
          <div style={{ fontSize: 12 }}>
            Details for <strong>{String(row.name)}</strong> ({String(row.plan)})
          </div>
        )}
      />
    );
  },
};

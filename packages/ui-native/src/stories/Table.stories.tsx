import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Table, type TableColumn } from '../components/Table';

const meta = { title: 'Native/Table' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Table />
    </View>
  ),
};

export const Dense: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Table dense />
    </View>
  ),
};

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
 *  inactive sortable columns show the neutral ↕ pair. Press a header to toggle. */
export const Sortable: Story = {
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
      <View style={{ width: 340 }}>
        <Table
          columns={SORTABLE_COLUMNS}
          rows={ROWS}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        />
      </View>
    );
  },
};

/** Row selection — a leading checkbox column with a select-all header (checked when
 *  all rows are selected, indeterminate when only some are). Selection is controlled
 *  via `selectedKeys` + `onSelectionChange`; pressing a row checkbox never fires
 *  `onRowClick`. */
export const Selectable: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['Liam Carter']);

    return (
      <View style={{ width: 340 }}>
        <Table
          columns={SORTABLE_COLUMNS}
          rows={ROWS}
          selectable
          rowKey={(row) => String(row.name)}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onRowClick={(row) => {
            // eslint-disable-next-line no-console
            console.log('row pressed', row.name);
          }}
        />
      </View>
    );
  },
};

/** Per-row tone tints — pass `rowTone` to flag rows `ok` / `warn` / `danger`. Each
 *  flagged row gets a subtle status wash (mint / amber / rose) plus a left accent bar,
 *  mirroring the admin "legal hold" + refund-flag treatments. Tints are decorative —
 *  no layout shift, and the pressed glass still reads on top. (A row's own `_tone`
 *  field is read as a fallback when `rowTone` isn't given.) */
export const RowTones: Story = {
  render: () => (
    <View style={{ width: 340 }}>
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
    </View>
  ),
};

/** Expandable detail rows — set `expandable` + `renderDetail` to add a leading chevron
 *  that toggles a full-width detail panel beneath each row. Uncontrolled here (internal
 *  state); pass `expandedKeys` + `onExpandedChange` to drive it from the outside. The
 *  chevron flips up→down and never fires `onRowClick`. */
export const Expandable: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <Table
        columns={SORTABLE_COLUMNS}
        rows={ROWS}
        expandable
        rowKey={(row) => String(row.name)}
        renderDetail={(row) => (
          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: colors.textDim }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{String(row.name)}</Text>
              {' '}— {String(row.plan)} plan
            </Text>
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: colors.textDim }}>
              Monthly recurring revenue: {String(row.mrr)}
            </Text>
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: colors.textDim }}>
              Account status: {String(row.status)}
            </Text>
          </View>
        )}
      />
    </View>
  ),
};

/** Controlled expansion + tones together — `expandedKeys`/`onExpandedChange` drive the
 *  open rows while `rowTone` flags them, showing the two additive capabilities compose. */
export const ExpandableControlled: Story = {
  render: () => {
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([
      'Emma Reyes',
    ]);

    return (
      <View style={{ width: 380 }}>
        <Table
          columns={SORTABLE_COLUMNS}
          rows={ROWS}
          expandable
          rowKey={(row) => String(row.name)}
          expandedKeys={expandedKeys}
          onExpandedChange={setExpandedKeys}
          rowTone={(row) => (row.status === 'Churned' ? 'danger' : undefined)}
          renderDetail={(row) => (
            <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: colors.textDim }}>
              Details for{' '}
              <Text style={{ fontWeight: '700', color: colors.text }}>{String(row.name)}</Text>
              {' '}({String(row.plan)})
            </Text>
          )}
        />
      </View>
    );
  },
};

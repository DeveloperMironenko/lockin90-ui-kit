import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
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

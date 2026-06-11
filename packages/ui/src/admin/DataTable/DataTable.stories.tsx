import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTable from './index';
import type { DataTableColumn } from './types';

interface Row {
  id: string;
  email: string;
  status: string;
  lastSeen: string;
}

const rows: Row[] = [
  { id: 'u_01', email: 'alex@team.com', status: 'ACTIVE', lastSeen: '2m ago' },
  { id: 'u_02', email: 'jordan@team.com', status: 'INVITED', lastSeen: '1h ago' },
  { id: 'u_03', email: 'sam@team.com', status: 'SUSPENDED', lastSeen: '3d ago' },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'email', header: 'Email', render: (r) => r.email },
  { key: 'status', header: 'Status', mono: true, render: (r) => r.status },
  { key: 'lastSeen', header: 'Last seen', align: 'right', mono: true, render: (r) => r.lastSeen },
];

const meta = {
  title: 'Admin/DataTable',
  component: DataTable<Row>,
  render: (args) => (
    <div style={{ width: 560 }}>
      <DataTable<Row> {...args} />
    </div>
  ),
} satisfies Meta<typeof DataTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { columns, rows, rowKey: (r) => r.id },
};

export const Selectable: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number>>(new Set(['u_01']));
    const toggle = (k: string | number) =>
      setSelected((s) => {
        const next = new Set(s);
        next.has(k) ? next.delete(k) : next.add(k);
        return next;
      });
    const toggleAll = () =>
      setSelected((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));
    return (
      <div style={{ width: 560 }}>
        <DataTable<Row>
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          selected={selected}
          onToggleSelect={toggle}
          onToggleSelectAll={toggleAll}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: { columns, rows: [], rowKey: (r) => r.id, loading: true, loadingRows: 5 },
};

export const Empty: Story = {
  args: { columns, rows: [], rowKey: (r) => r.id },
};

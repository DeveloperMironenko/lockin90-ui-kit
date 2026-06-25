import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  PermissionMatrix,
  type MatrixCol,
  type MatrixRow,
  type MatrixState,
} from '../admin/PermissionMatrix';

const meta = {
  title: 'Primitives/PermissionMatrix',
  component: PermissionMatrix,
  parameters: { layout: 'padded' },
  args: { rows: [], cols: [], cells: {} },
} satisfies Meta<typeof PermissionMatrix>;
export default meta;

const cols: MatrixCol[] = [
  { key: 'root', label: 'root' },
  { key: 'billing', label: 'billing' },
  { key: 'mod', label: 'mod' },
  { key: 'support', label: 'support' },
];

const rows: MatrixRow[] = [
  { key: 'users.read', label: 'users.read', desc: 'view account records' },
  { key: 'users.suspend', label: 'users.suspend', desc: 'block / suspend accounts', danger: true },
  { key: 'billing.refund', label: 'billing.refund', desc: 'issue Stripe refunds', danger: true },
  { key: 'billing.plan', label: 'billing.plan', desc: 'change subscription tier' },
  { key: 'broadcasts.send', label: 'broadcasts.send', desc: 'push / email broadcasts', danger: true },
  { key: 'coach.moderate', label: 'coach.moderate', desc: 'resolve report queues' },
  { key: 'keys.rotate', label: 'keys.rotate', desc: 'rotate webhook signing keys', danger: true },
];

const initialCells: Record<string, Record<string, MatrixState>> = {
  'users.read': { root: 'locked', billing: 'on', mod: 'on', support: 'on' },
  'users.suspend': { root: 'locked', billing: 'off', mod: 'on', support: 'off' },
  'billing.refund': { root: 'locked', billing: 'on', mod: 'off', support: 'off' },
  'billing.plan': { root: 'locked', billing: 'on', mod: 'off', support: 'na' },
  'broadcasts.send': { root: 'locked', billing: 'off', mod: 'on', support: 'off' },
  'coach.moderate': { root: 'locked', billing: 'off', mod: 'on', support: 'off' },
  'keys.rotate': { root: 'locked', billing: 'na', mod: 'na', support: 'na' },
};

/** Wires onToggle to local state so on/off cells flip when clicked. */
function Live() {
  const [cells, setCells] = useState(initialCells);
  const onToggle = (rowKey: string, colKey: string) => {
    setCells((prev) => {
      const current = prev[rowKey]?.[colKey];
      if (current !== 'on' && current !== 'off') return prev;
      return {
        ...prev,
        [rowKey]: { ...prev[rowKey], [colKey]: current === 'on' ? 'off' : 'on' },
      };
    });
  };
  return <PermissionMatrix rows={rows} cols={cols} cells={cells} onToggle={onToggle} />;
}

export const RolesAndCapabilities: StoryObj<typeof meta> = {
  render: () => <Live />,
};

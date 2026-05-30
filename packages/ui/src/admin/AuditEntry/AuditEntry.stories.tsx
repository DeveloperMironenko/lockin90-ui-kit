import type { Meta, StoryObj } from '@storybook/react-vite';
import AuditEntry from './index';

const meta = {
  title: 'Admin/AuditEntry',
  component: AuditEntry,
  args: {
    timestamp: '2026-05-28 12:04',
    adminEmail: 'ops@lockin90.com',
    action: 'UPDATE',
    targetLabel: 'user:u_01',
    summary: 'Changed training level to advanced',
  },
  render: (args) => (
    <div style={{ width: 560 }}>
      <AuditEntry {...args} />
    </div>
  ),
} satisfies Meta<typeof AuditEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mutation: Story = {};
export const Destructive: Story = {
  args: { action: 'DELETE', targetLabel: 'session:s_88', summary: 'Removed flagged session' },
};
export const Creation: Story = {
  args: { action: 'GRANT', targetLabel: 'role:admin', summary: 'Granted admin role' },
};

export const Log: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <AuditEntry timestamp="12:04" adminEmail="ops@lockin90.com" action="GRANT" targetLabel="role:admin" summary="Granted admin role" />
      <AuditEntry timestamp="12:02" adminEmail="ops@lockin90.com" action="UPDATE" targetLabel="user:u_01" summary="Changed level" />
      <AuditEntry timestamp="11:58" adminEmail="ops@lockin90.com" action="DELETE" targetLabel="session:s_88" summary="Removed session" />
    </div>
  ),
};

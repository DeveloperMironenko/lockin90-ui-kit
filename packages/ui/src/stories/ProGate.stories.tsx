import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProGate, LockedRow } from '../components/ProGate';

const meta = {
  title: 'Primitives/ProGate',
  component: ProGate,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ProGate>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const WithContent: StoryObj<typeof meta> = {
  render: () => (
    <ProGate>
      <div
        style={{ height: 160, background: 'linear-gradient(120deg,var(--accent),var(--cyan))', borderRadius: 8 }}
      />
    </ProGate>
  ),
};

export const Locked: StoryObj<typeof meta> = { render: () => <LockedRow /> };

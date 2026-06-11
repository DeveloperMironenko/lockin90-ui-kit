import type { Meta, StoryObj } from '@storybook/react-vite';
import Pulse from './index';

const meta = {
  title: 'Primitives/Pulse',
  component: Pulse,
  args: { tone: 'ok', size: 9 },
  argTypes: { tone: { control: 'inline-radio', options: ['ok', 'warn', 'bad'] } },
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = { args: { tone: 'ok' } };
export const Warn: Story = { args: { tone: 'warn' } };
export const Bad: Story = { args: { tone: 'bad' } };

export const InContext: StoryObj = {
  render: () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }} className="font-mono text-[11px] text-secondary">
      <Pulse tone="ok" /> Synced · 2m ago
    </span>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import StatBlock from './index';

const meta = {
  title: 'Primitives/StatBlock',
  component: StatBlock,
  args: { label: 'RESTING HR', value: '52', unit: 'bpm' },
} satisfies Meta<typeof StatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoUnit: Story = { args: { label: 'STREAK', value: '14', unit: undefined } };

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: 420 }}>
      <StatBlock label="RESTING HR" value="52" unit="bpm" />
      <StatBlock label="HRV" value="68" unit="ms" />
      <StatBlock label="SLEEP" value="7.4" unit="hrs" />
    </div>
  ),
};

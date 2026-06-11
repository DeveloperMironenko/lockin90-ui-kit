import type { Meta, StoryObj } from '@storybook/react-vite';
import BarFill from './index';

const meta = {
  title: 'Primitives/BarFill',
  component: BarFill,
  args: { value: 0.72, tone: 'cta', height: 8, immediate: true },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    tone: { control: 'inline-radio', options: ['cta', 'mint', 'warm', 'violet'] },
  },
} satisfies Meta<typeof BarFill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stack: StoryObj = {
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <BarFill value={0.82} tone="mint" immediate />
      <BarFill value={0.54} tone="cta" immediate />
      <BarFill value={0.31} tone="warm" immediate />
    </div>
  ),
};

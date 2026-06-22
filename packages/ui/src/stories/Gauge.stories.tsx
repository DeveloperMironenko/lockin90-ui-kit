import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gauge } from '../components/Gauge';

const meta = {
  title: 'Primitives/Gauge',
  component: Gauge,
} satisfies Meta<typeof Gauge>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { value: 78, label: 'ENERGY' },
};

export const Zones: StoryObj<typeof meta> = {
  args: {
    value: 78,
    label: 'TODAY',
    zones: [
      { to: 34, color: 'var(--zone-low)' },
      { to: 67, color: 'var(--zone-mid)' },
      { to: 100, color: 'var(--zone-high)' },
    ],
  },
};

export const Ticks: StoryObj<typeof meta> = {
  args: { value: 64, label: 'SCORE', ticks: 7 },
};

export const Sizes: StoryObj<typeof meta> = {
  args: { value: 64 },
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Gauge size={96} value={38} thickness={8} sweep={180} label="LOW" />
      <Gauge size={130} value={64} thickness={11} label="MID" />
      <Gauge
        size={170}
        value={88}
        thickness={16}
        label="HIGH"
        zones={[
          { to: 34, color: 'var(--zone-low)' },
          { to: 67, color: 'var(--zone-mid)' },
          { to: 100, color: 'var(--zone-high)' },
        ]}
      />
    </div>
  ),
};

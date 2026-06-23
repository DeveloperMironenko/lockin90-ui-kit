import type { Meta, StoryObj } from '@storybook/react-vite';
import { EffectAttributionLine } from '../components/EffectAttributionLine';

const meta = {
  title: 'Primitives/EffectAttributionLine',
  component: EffectAttributionLine,
} satisfies Meta<typeof EffectAttributionLine>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: { value: 12, unit: 'pts', label: 'Deep sleep 1h20m' },
};

export const Negative: Story = {
  args: { value: -18, unit: 'm', label: 'deep sleep / late-caffeine night' },
};

export const Neutral: Story = {
  args: { value: 0, unit: 'pts', label: 'no net change' },
};

export const WithIcon: Story = {
  args: { value: 7, unit: 'pts', label: 'morning sunlight', icon: 'sparkle' },
};

export const Stack: Story = {
  args: { value: 0, label: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <EffectAttributionLine value={14} unit="pts" label="Deep sleep 1h20m" icon="mood-great" />
      <EffectAttributionLine value={6} unit="pts" label="Morning sunlight 20m" icon="sparkle" />
      <EffectAttributionLine value={-9} unit="pts" label="Late caffeine 14:40" icon="warning" />
      <EffectAttributionLine value={-4} unit="pts" label="Low hydration" />
      <EffectAttributionLine value={0} unit="pts" label="No training load change" />
    </div>
  ),
};

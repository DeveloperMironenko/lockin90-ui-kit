import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeBar } from '../components/RangeBar';

const meta = {
  title: 'Primitives/RangeBar',
  component: RangeBar,
} satisfies Meta<typeof RangeBar>;
export default meta;

type Story = StoryObj<typeof meta>;

// Total testosterone — in optimal range
export const Default: Story = {
  args: { value: 742, min: 264, max: 916, low: 400, high: 800, label: 'Testosterone', unit: 'ng/dL', showValue: true },
};

// Fasting glucose — high-normal, watch (lands in the high zone → bad tone)
export const HighWatch: Story = {
  args: { value: 96, min: 70, max: 99, low: 75, high: 90, label: 'Fasting glucose', unit: 'mg/dL', showValue: true },
};

// Below the optimal band → warn tone
export const LowOutOfRange: Story = {
  args: { value: 280, min: 264, max: 916, low: 400, high: 800, label: 'Testosterone', unit: 'ng/dL', showValue: true },
};

// Force the marker tone regardless of zone
export const ForcedTone: Story = {
  args: { value: 60, min: 0, max: 100, low: 40, high: 80, label: 'Marker', unit: '', showValue: true, markerTone: 'warn' },
};

// No header — bare track + marker
export const TrackOnly: Story = {
  args: { value: 1.8, min: 0.4, max: 4, low: 0.8, high: 3.2 },
};

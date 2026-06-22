import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter } from '../components/Meter';

const meta = {
  title: 'Primitives/Meter',
  component: Meter,
} satisfies Meta<typeof Meter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 72, label: 'Readiness', showValue: true, unit: '%' },
};

export const WithThreshold: Story = {
  args: { value: 64, label: 'Energy', showValue: true, unit: '%', threshold: 80 },
};

export const ToneHigh: Story = {
  args: { value: 88, label: 'Recovery', showValue: true, unit: '%', tone: 'high' },
};

export const ToneMid: Story = {
  args: { value: 52, label: 'Strain', showValue: true, unit: '%', tone: 'mid' },
};

export const ToneLow: Story = {
  args: { value: 21, label: 'Sleep debt', showValue: true, unit: '%', tone: 'low' },
};

export const Segmented: Story = {
  args: { value: 3, min: 0, max: 4, label: 'Password strength', segments: 4, tone: 'high' },
};

export const Confidence: Story = {
  args: { value: 80, label: 'Confidence', showValue: true, unit: '%', segments: 5 },
};

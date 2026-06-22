import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { StackedBar, type StackedSegment } from '../components/StackedBar';

const meta = { title: 'Native/StackedBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** Energy-zone distribution. */
const ZONES: StackedSegment[] = [
  { value: 62, color: colors.mint, label: 'High' },
  { value: 26, color: colors.accent, label: 'Mid' },
  { value: 12, color: 'rgba(255,255,255,0.16)', label: 'Low' },
];

/** Time-by-activity. */
const ACTIVITY: StackedSegment[] = [
  { value: 13.1, color: colors.mint, label: 'Deep work' },
  { value: 9.2, color: colors.magenta, label: 'Meetings' },
  { value: 6.5, color: colors.cyan, label: 'Office work' },
  { value: 4.2, color: colors.violet, label: 'Breaks' },
];

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <StackedBar segments={ZONES} />
    </View>
  ),
};

export const WithLegend: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <StackedBar segments={ZONES} showLegend />
    </View>
  ),
};

export const Squared: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <StackedBar segments={ZONES} rounded={false} height={14} />
    </View>
  ),
};

export const NoGap: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <StackedBar segments={ZONES} gap={0} rounded={false} height={16} />
    </View>
  ),
};

export const Activity: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <StackedBar segments={ACTIVITY} height={12} showLegend />
    </View>
  ),
};

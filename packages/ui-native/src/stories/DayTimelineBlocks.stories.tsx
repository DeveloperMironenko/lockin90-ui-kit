import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { DayTimelineBlocks } from '../components/DayTimelineBlocks';

const meta = { title: 'Native/DayTimelineBlocks' } satisfies Meta;
export default meta;

type Story = StoryObj;

// A full work-day across the 24h rail, with the "now" marker mid-afternoon.
export const Default: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayTimelineBlocks
        blocks={[
          { start: 7.75, end: 8.6, label: 'Commute', color: colors.indigo },
          { start: 9, end: 10.5, label: 'Deep work', color: colors.mint },
          { start: 10.5, end: 12, label: 'Meetings', color: colors.violet },
          { start: 12, end: 12.75, label: 'Break', color: colors.warn },
          { start: 13.25, end: 15, label: 'Deep work', color: colors.mint },
        ]}
        now={14.7}
      />
    </View>
  ),
};

// A custom rail window (6am → 11pm) — blocks + ticks rescale to the span.
export const CustomRange: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayTimelineBlocks
        startHour={6}
        endHour={23}
        blocks={[
          { start: 6.5, end: 7.25, label: 'Workout', color: colors.cyan },
          { start: 9, end: 12, label: 'Focus', color: colors.mint },
          { start: 13, end: 17, label: 'Meetings', color: colors.violet },
          { start: 19.5, end: 21, label: 'Reading', color: colors.accent },
        ]}
        now={15.2}
      />
    </View>
  ),
};

// No "now" marker — bare rail + blocks + hour ticks.
export const NoNow: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayTimelineBlocks
        blocks={[
          { start: 8, end: 10, label: 'Deep work', color: colors.mint },
          { start: 11, end: 13, label: 'Meetings', color: colors.violet },
          { start: 14, end: 18, label: 'Build', color: colors.cyan },
        ]}
      />
    </View>
  ),
};

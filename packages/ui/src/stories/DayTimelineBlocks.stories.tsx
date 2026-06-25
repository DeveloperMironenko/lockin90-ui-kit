import type { Meta, StoryObj } from '@storybook/react-vite';
import { DayTimelineBlocks } from '../components/DayTimelineBlocks';

const meta = {
  title: 'Primitives/DayTimelineBlocks',
  component: DayTimelineBlocks,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DayTimelineBlocks>;
export default meta;

type Story = StoryObj<typeof meta>;

// A full work-day across the 24h rail, with the "now" marker mid-afternoon.
export const Default: Story = {
  args: {
    blocks: [
      { start: 7.75, end: 8.6, label: 'Commute', color: 'var(--indigo)' },
      { start: 9, end: 10.5, label: 'Deep work', color: 'var(--mint)' },
      { start: 10.5, end: 12, label: 'Meetings', color: 'var(--violet)' },
      { start: 12, end: 12.75, label: 'Break', color: 'var(--warn)' },
      { start: 13.25, end: 15, label: 'Deep work', color: 'var(--mint)' },
    ],
    now: 14.7,
  },
};

// A custom rail window (6am → 11pm) — blocks + ticks rescale to the span.
export const CustomRange: Story = {
  args: {
    startHour: 6,
    endHour: 23,
    blocks: [
      { start: 6.5, end: 7.25, label: 'Workout', color: 'var(--cyan)' },
      { start: 9, end: 12, label: 'Focus', color: 'var(--mint)' },
      { start: 13, end: 17, label: 'Meetings', color: 'var(--violet)' },
      { start: 19.5, end: 21, label: 'Reading', color: 'var(--accent)' },
    ],
    now: 15.2,
  },
};

// No "now" marker — bare rail + blocks + hour ticks.
export const NoNow: Story = {
  args: {
    blocks: [
      { start: 8, end: 10, label: 'Deep work', color: 'var(--mint)' },
      { start: 11, end: 13, label: 'Meetings', color: 'var(--violet)' },
      { start: 14, end: 18, label: 'Build', color: 'var(--cyan)' },
    ],
  },
};

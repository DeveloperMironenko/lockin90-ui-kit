import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBar, type StackedSegment } from '../components/StackedBar';

const meta = {
  title: 'Primitives/StackedBar',
  component: StackedBar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StackedBar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Energy-zone distribution. */
const ZONES: StackedSegment[] = [
  { value: 62, color: 'var(--mint)', label: 'High' },
  { value: 26, color: 'var(--accent)', label: 'Mid' },
  { value: 12, color: 'rgba(255,255,255,0.16)', label: 'Low' },
];

/** Time-by-activity. */
const ACTIVITY: StackedSegment[] = [
  { value: 13.1, color: 'var(--mint)', label: 'Deep work' },
  { value: 9.2, color: 'var(--magenta)', label: 'Meetings' },
  { value: 6.5, color: 'var(--cyan)', label: 'Office work' },
  { value: 4.2, color: 'var(--violet)', label: 'Breaks' },
];

export const Default: Story = { args: { segments: ZONES } };

export const WithLegend: Story = { args: { segments: ZONES, showLegend: true } };

export const Squared: Story = {
  args: { segments: ZONES, rounded: false, height: 14 },
};

export const NoGap: Story = {
  args: { segments: ZONES, gap: 0, rounded: false, height: 16 },
};

export const Activity: Story = {
  args: { segments: ACTIVITY, height: 12, showLegend: true },
};

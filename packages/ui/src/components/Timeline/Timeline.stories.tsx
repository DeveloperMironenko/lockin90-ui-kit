import type { Meta, StoryObj } from '@storybook/react-vite';
import Timeline, { TimelineItem } from './index';

const meta = {
  title: 'Patterns/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj;

export const Events: Story = {
  render: () => (
    <div style={{ width: 420 }} className="ea-card">
      <Timeline>
        <TimelineItem title="Logged espresso" time="4:12pm" tone="warn">Caffeine 80mg · may delay sleep onset</TimelineItem>
        <TimelineItem title="Squat session" time="1:30pm" tone="accent">Heavy · 5×5 @ 140kg</TimelineItem>
        <TimelineItem title="Oura synced" time="8:03am" tone="ok">HRV 74ms · readiness 81</TimelineItem>
        <TimelineItem title="Woke up" time="6:48am" tone="ok">7.4h · 1.6h deep</TimelineItem>
      </Timeline>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import AttributionCard from './index';

const meta = {
  title: 'Patterns/AttributionCard',
  component: AttributionCard,
} satisfies Meta<typeof AttributionCard>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <AttributionCard title="WHY 78?">
        Your afternoon dip is driven by <b>yesterday&apos;s late caffeine</b> (2 cups after 4pm)
        and <b>poor deep sleep</b> (−42 min vs. your baseline). Morning HRV held strong.
      </AttributionCard>
    </div>
  ),
};

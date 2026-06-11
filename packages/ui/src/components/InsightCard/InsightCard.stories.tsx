import type { Meta, StoryObj } from '@storybook/react-vite';
import InsightCard from './index';

const meta = {
  title: 'Patterns/InsightCard',
  component: InsightCard,
} satisfies Meta<typeof InsightCard>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <InsightCard
        eyebrow="PATTERN DETECTED"
        title="Late caffeine costs you ~6 energy points"
        body="On the 8 days you had coffee after 4pm, your next-day morning energy dropped an average of 6.2 points and deep sleep fell 22%."
        chips={[
          { label: '8 days', tone: 'accent' },
          { label: '−6.2 avg', tone: 'low' },
          { label: 'high confidence', tone: 'high' },
        ]}
        spark={[78, 74, 70, 66, 72, 64, 60, 68]}
      />
    </div>
  ),
};

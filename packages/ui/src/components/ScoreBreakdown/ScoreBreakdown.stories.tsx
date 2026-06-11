import type { Meta, StoryObj } from '@storybook/react-vite';
import ScoreBreakdown from './index';

const meta = {
  title: 'Patterns/ScoreBreakdown',
  component: ScoreBreakdown,
} satisfies Meta<typeof ScoreBreakdown>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }} className="ea-card ea-card-lit">
      <ScoreBreakdown
        items={[
          { name: 'Deep sleep', detail: '+38 min vs avg', value: 9 },
          { name: 'Morning HRV', detail: 'strong rebound', value: 6 },
          { name: 'Late caffeine', detail: '2 cups after 4pm', value: -7 },
          { name: 'Training load', detail: 'heavy squats', value: -4 },
        ]}
      />
    </div>
  ),
};

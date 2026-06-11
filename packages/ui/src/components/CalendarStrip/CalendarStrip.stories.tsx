import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarStrip from './index';

const meta = {
  title: 'Patterns/CalendarStrip',
  component: CalendarStrip,
} satisfies Meta<typeof CalendarStrip>;

export default meta;
type Story = StoryObj;

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const values = [72, 64, 81, 48, 77, 90, 58, 70, 33, 85, 79, 61, 88, 78];

export const TwoWeeks: Story = {
  render: () => (
    <div style={{ maxWidth: 680 }} className="ea-card ea-card-lit">
      <CalendarStrip
        days={values.map((v, i) => ({
          label: DOW[i % 7],
          date: 1 + i,
          value: v,
          low: v < 40,
          today: i === values.length - 1,
        }))}
      />
    </div>
  ),
};

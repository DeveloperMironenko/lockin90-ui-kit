import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProGate } from '../components/ProGate';
import { MetricTile } from '../components/MetricTile';

const meta = {
  title: 'Primitives/ProGate',
  component: ProGate,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProGate>;
export default meta;

type Story = StoryObj<typeof meta>;

/* Wraps premium content — shown blurred + dimmed behind the lock card. */
export const Default: Story = {
  args: {
    title: 'PRO Feature',
    subtitle: 'Visualize PR progression with PRO',
    children: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <MetricTile label="1RM Bench" value="102" unit="kg" delta="+4" deltaTone="up" />
        <MetricTile label="1RM Squat" value="148" unit="kg" delta="+6" deltaTone="up" />
        <MetricTile label="1RM Deadlift" value="180" unit="kg" delta="+8" deltaTone="up" />
        <MetricTile label="1RM OHP" value="61" unit="kg" delta="+2" deltaTone="up" />
      </div>
    ),
  },
};

/* Empty gate — a glass placeholder fills the area behind the lock card. */
export const Empty: Story = {
  args: {
    title: 'PRO Feature',
    subtitle: 'Unlock advanced insights',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from '../components/Toast';
import { Badge } from '../components/Toast';

const meta = {
  title: 'Primitives/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Success: StoryObj<typeof meta> = {
  args: { tone: 'success', title: 'Workout logged', message: '+1,000 kg volume' },
};

export const Badges: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge tone="accent">3</Badge>
      <Badge tone="high">12</Badge>
      <Badge tone="mid">7</Badge>
      <Badge tone="low">99+</Badge>
      <Badge tone="neutral">new</Badge>
      <Badge tone="low" dot />
    </div>
  ),
};

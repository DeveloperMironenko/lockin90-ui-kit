import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './index';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  args: {
    icon: '⚡',
    eyebrow: 'NO DATA',
    heading: 'No sessions yet',
    description: 'Log your first training session to start tracking energy.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button variant="primary">Log session</Button>,
  },
};

export const Minimal: Story = {
  args: {
    icon: undefined,
    eyebrow: undefined,
    heading: 'Nothing here',
    description: undefined,
  },
};

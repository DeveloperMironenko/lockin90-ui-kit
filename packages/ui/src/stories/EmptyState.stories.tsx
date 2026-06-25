import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <EmptyState
      title="No achievements yet"
      description="Your streak, XP and badges all grow from what you log. Log your first event to begin."
      action={<Button variant="primary">Get started</Button>}
    />
  ),
};

export const Compact: StoryObj<typeof meta> = {
  args: {
    compact: true,
    title: 'No baseline yet',
    description: "Once you've logged for a couple of weeks, then-vs-now shows up here.",
  },
};

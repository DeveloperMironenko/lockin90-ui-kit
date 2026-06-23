import type { Meta, StoryObj } from '@storybook/react-vite';
import { EngagementBar } from '../components/EngagementBar';

const meta = {
  title: 'Primitives/EngagementBar',
  component: EngagementBar,
} satisfies Meta<typeof EngagementBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    like: { count: 128, active: false },
    comment: { count: 24 },
    share: {},
    save: { active: false },
  },
};

export const LikedAndSaved: Story = {
  args: {
    like: { count: 342, active: true },
    comment: { count: 57 },
    share: {},
    save: { active: true },
  },
};

export const MinimalLikeOnly: Story = {
  args: {
    like: { count: 96, active: false },
  },
};

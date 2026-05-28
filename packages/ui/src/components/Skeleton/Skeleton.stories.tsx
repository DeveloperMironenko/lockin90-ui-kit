import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonList } from './index';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Skeleton h="72px" />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <SkeletonList count={4} h="48px" />
    </div>
  ),
};

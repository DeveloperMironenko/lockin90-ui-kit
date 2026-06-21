import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeedPost } from '../components/FeedPost';

const meta = {
  title: 'Components/FeedPost',
  component: FeedPost,
} satisfies Meta<typeof FeedPost>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

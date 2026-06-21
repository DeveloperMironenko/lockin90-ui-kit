import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatThread } from '../components/ChatThread';

const meta = {
  title: 'Components/ChatThread',
  component: ChatThread,
} satisfies Meta<typeof ChatThread>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

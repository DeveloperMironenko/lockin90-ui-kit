import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatExtras } from '../components/ChatExtras';

const meta = {
  title: 'Components/ChatExtras',
  component: ChatExtras,
} satisfies Meta<typeof ChatExtras>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

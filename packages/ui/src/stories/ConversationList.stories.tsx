import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConversationList } from '../components/ConversationList';

const meta = {
  title: 'Components/ConversationList',
  component: ConversationList,
} satisfies Meta<typeof ConversationList>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

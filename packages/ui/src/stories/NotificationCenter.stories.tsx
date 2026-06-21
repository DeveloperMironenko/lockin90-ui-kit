import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationCenter } from '../components/NotificationCenter';

const meta = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
} satisfies Meta<typeof NotificationCenter>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

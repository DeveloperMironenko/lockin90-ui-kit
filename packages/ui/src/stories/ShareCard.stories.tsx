import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareCard } from '../components/ShareCard';

const meta = {
  title: 'Components/ShareCard',
  component: ShareCard,
} satisfies Meta<typeof ShareCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

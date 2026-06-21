import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityTimeline } from '../components/ActivityTimeline';

const meta = {
  title: 'Components/ActivityTimeline',
  component: ActivityTimeline,
} satisfies Meta<typeof ActivityTimeline>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

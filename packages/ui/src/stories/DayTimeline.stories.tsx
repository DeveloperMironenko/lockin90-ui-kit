import type { Meta, StoryObj } from '@storybook/react-vite';
import { DayTimeline } from '../components/DayTimeline';

const meta = {
  title: 'Components/DayTimeline',
  component: DayTimeline,
} satisfies Meta<typeof DayTimeline>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

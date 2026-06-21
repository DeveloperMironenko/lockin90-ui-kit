import type { Meta, StoryObj } from '@storybook/react-vite';
import { WeekdayBars } from '../components/WeekdayBars';

const meta = {
  title: 'Components/WeekdayBars',
  component: WeekdayBars,
} satisfies Meta<typeof WeekdayBars>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

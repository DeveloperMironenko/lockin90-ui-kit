import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarHeatmap } from '../components/CalendarHeatmap';

const meta = {
  title: 'Components/CalendarHeatmap',
  component: CalendarHeatmap,
} satisfies Meta<typeof CalendarHeatmap>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

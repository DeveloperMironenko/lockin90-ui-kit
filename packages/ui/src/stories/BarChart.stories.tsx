import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from '../components/BarChart';

const meta = {
  title: 'Primitives/BarChart',
  component: BarChart,
} satisfies Meta<typeof BarChart>;
export default meta;

/** Defaults: 7 weekday-style bars, Wed highlighted (mint), Sat in zone-mid. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** Bars only, no value labels above. */
export const NoValues: StoryObj<typeof meta> = { args: { showValues: false } };

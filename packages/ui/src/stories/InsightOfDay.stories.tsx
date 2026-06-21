import type { Meta, StoryObj } from '@storybook/react-vite';
import { InsightOfDay } from '../components/InsightOfDay';

const meta = {
  title: 'Components/InsightOfDay',
  component: InsightOfDay,
} satisfies Meta<typeof InsightOfDay>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

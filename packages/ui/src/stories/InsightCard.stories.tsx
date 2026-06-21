import type { Meta, StoryObj } from '@storybook/react-vite';
import { InsightCard } from '../components/InsightCard';

const meta = {
  title: 'Components/InsightCard',
  component: InsightCard,
} satisfies Meta<typeof InsightCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

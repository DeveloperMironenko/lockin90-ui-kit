import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeneticInsightCard } from '../components/GeneticInsightCard';

const meta = {
  title: 'Components/GeneticInsightCard',
  component: GeneticInsightCard,
} satisfies Meta<typeof GeneticInsightCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

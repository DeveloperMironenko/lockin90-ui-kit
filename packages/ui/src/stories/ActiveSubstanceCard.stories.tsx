import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveSubstanceCard } from '../components/ActiveSubstanceCard';

const meta = {
  title: 'Components/ActiveSubstanceCard',
  component: ActiveSubstanceCard,
} satisfies Meta<typeof ActiveSubstanceCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

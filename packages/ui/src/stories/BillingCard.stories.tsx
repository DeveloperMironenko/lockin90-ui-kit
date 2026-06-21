import type { Meta, StoryObj } from '@storybook/react-vite';
import { BillingCard } from '../components/BillingCard';

const meta = {
  title: 'Components/BillingCard',
  component: BillingCard,
} satisfies Meta<typeof BillingCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

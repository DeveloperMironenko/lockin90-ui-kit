import type { Meta, StoryObj } from '@storybook/react-vite';
import { SleepDebtChart } from '../components/SleepDebtChart';

const meta = {
  title: 'Components/SleepDebtChart',
  component: SleepDebtChart,
} satisfies Meta<typeof SleepDebtChart>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnergyForecast } from '../components/EnergyForecast';

const meta = {
  title: 'Components/EnergyForecast',
  component: EnergyForecast,
} satisfies Meta<typeof EnergyForecast>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

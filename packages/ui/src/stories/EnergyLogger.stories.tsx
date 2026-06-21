import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnergyLogger } from '../components/EnergyLogger';

const meta = {
  title: 'Components/EnergyLogger',
  component: EnergyLogger,
} satisfies Meta<typeof EnergyLogger>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

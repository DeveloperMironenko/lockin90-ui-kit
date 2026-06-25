import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, NumberStepper } from '../components/Stepper';

const meta = {
  title: 'Primitives/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Stepper>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Quantity: StoryObj<typeof meta> = {
  render: () => <NumberStepper />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, NumberStepper } from '../components/Stepper';

const meta = {
  title: 'Primitives/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Stepper>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

/** Onboarding "Complete" — current (final) node also reads done; whole rail finished. */
export const Complete: StoryObj<typeof meta> = {
  args: { current: 3, complete: true },
};

export const Quantity: StoryObj<typeof meta> = {
  render: () => <NumberStepper />,
};

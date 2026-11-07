import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepIndex } from '../components/StepIndex';

const meta = {
  title: 'Primitives/StepIndex',
  component: StepIndex,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StepIndex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Number: Story = { args: { step: 1 } };
export const Done: Story = { args: { step: 2, done: true } };

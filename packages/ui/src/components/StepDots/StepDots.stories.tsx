import type { Meta, StoryObj } from '@storybook/react-vite';
import StepDots from './index';

const meta: Meta<typeof StepDots> = {
  title: 'Onboarding/StepDots',
  component: StepDots,
  args: { current: 2, total: 4 },
};
export default meta;

type Story = StoryObj<typeof StepDots>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
      <StepDots current={1} total={4} />
      <StepDots current={2} total={4} />
      <StepDots current={3} total={4} />
      <StepDots current={4} total={4} />
    </div>
  ),
};

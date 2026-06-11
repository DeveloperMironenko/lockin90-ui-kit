import type { Meta, StoryObj } from '@storybook/react-vite';
import GradientText from './index';

const meta = {
  title: 'Primitives/GradientText',
  component: GradientText,
} satisfies Meta<typeof GradientText>;

export default meta;
type Story = StoryObj; // render-only demos

export const Flux: Story = {
  render: () => (
    <span className="font-display font-bold" style={{ fontSize: 72, letterSpacing: '-0.03em' }}>
      <GradientText variant="flux">78</GradientText>
    </span>
  ),
};

export const Cta: Story = {
  render: () => (
    <span className="font-display font-bold" style={{ fontSize: 48 }}>
      <GradientText variant="cta">Lock in 90 days</GradientText>
    </span>
  ),
};

export const Violet: Story = {
  render: () => (
    <span className="font-display font-bold" style={{ fontSize: 48 }}>
      <GradientText variant="violet">Recovery</GradientText>
    </span>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import EnergyRing from './index';

const meta: Meta<typeof EnergyRing> = {
  title: 'Energy/EnergyRing',
  component: EnergyRing,
  args: { score: 78, size: 240 },
};
export default meta;

type Story = StoryObj<typeof EnergyRing>;

export const Today: Story = {};
export const Low: Story = { args: { score: 41, gradient: 'zone' } };
export const Mini: Story = { args: { score: 74, size: 64, stroke: 6, showValue: false, sub: null } };
export const Trio: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 18 }}>
      <EnergyRing score={81} size={120} gradient="mint" sub="RECOVERY" />
      <EnergyRing score={68} size={120} gradient="cta" sub="READINESS" />
      <EnergyRing score={74} size={120} gradient="flux" sub="SLEEP" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Stepper, NumberStepper } from '../components/Stepper';

const meta = { title: 'Native/Stepper' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Stepper />
    </View>
  ),
};

export const FirstStep: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Stepper
        current={0}
        steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Goals' }, { label: 'Done' }]}
      />
    </View>
  ),
};

/** Onboarding tracker variant — 40px nodes, hollow mint "done", CTA "current"
 *  (static stronger glow; pulse animation is web-only by design), mint connectors. */
export const Glow: Story = {
  render: () => (
    <View style={{ width: 420 }}>
      <Stepper
        variant="glow"
        current={2}
        steps={[
          { label: 'Connect' },
          { label: 'Permissions' },
          { label: 'Goals' },
          { label: 'Review' },
        ]}
      />
    </View>
  ),
};

export const Quantity: Story = {
  render: () => <NumberStepper value={3} min={0} max={10} />,
};

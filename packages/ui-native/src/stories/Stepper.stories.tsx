import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
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

/** Original 30px filled rail — explicit `variant="compact"` (matches default). */
export const Compact: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Stepper variant="compact" />
    </View>
  ),
};

/** Onboarding "Complete" — current (final) node also reads done; whole rail finished. */
export const Complete: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Stepper current={3} complete />
    </View>
  ),
};

/** Onboarding tracker variant — 40px nodes, hollow mint "done", CTA "current"
 *  (static stronger glow; pulse animation is web-only by design), mint connectors. */
export const Glow: Story = {
  render: () => (
    // Fill the host container (the on-device story card is ~348pt on a 390pt
    // phone) and cap at the web demo's 560 — never a fixed width wider than
    // the device, or the last step clips off the card edge.
    <View style={{ width: '100%', maxWidth: 560 }}>
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

/** Press-to-navigate — `onStepClick` makes each node + label pressable. Done +
 *  current nodes are interactive; future nodes are disabled so users can't jump
 *  ahead. Press a node to seek the rail. */
export const Interactive: Story = {
  render: () => {
    const steps = [
      { label: 'Connect' },
      { label: 'Permissions' },
      { label: 'Goals' },
      { label: 'Review' },
    ];
    const [current, setCurrent] = useState(2);
    return (
      <View style={{ width: '100%', maxWidth: 560, gap: 16 }}>
        <Stepper
          variant="glow"
          steps={steps}
          current={current}
          onStepClick={(i) => setCurrent(i)}
        />
        <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>
          current = {current} ({steps[current]?.label})
        </Text>
      </View>
    );
  },
};

export const Quantity: Story = {
  render: () => <NumberStepper value={3} min={0} max={10} />,
};

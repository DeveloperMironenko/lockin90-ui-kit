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

export const Quantity: Story = {
  render: () => <NumberStepper value={3} min={0} max={10} />,
};

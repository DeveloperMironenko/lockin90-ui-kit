import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Checkbox, Radio, RadioGroup } from '../components/Checkbox';

const meta = { title: 'Native/Checkbox' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Checkboxes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox label="Remember me" checked />
      <Checkbox label="Select all" indeterminate />
      <Checkbox label="Unchecked" />
      <Checkbox label="Disabled" disabled checked />
    </View>
  ),
};

export const Radios: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Radio label="Focus" checked />
      <Radio label="Recover" />
    </View>
  ),
};

export const Group: Story = {
  render: () => (
    <RadioGroup
      value="focus"
      options={[
        { value: 'recover', label: 'Recover' },
        { value: 'focus', label: 'Focus' },
        { value: 'perform', label: 'Perform' },
      ]}
    />
  ),
};

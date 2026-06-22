import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Select } from '../components/Select';

const meta = { title: 'Native/Select' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Select placeholder="Select an option" />
    </View>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Select
        label="Unit system"
        value="metric"
        options={[
          { value: 'metric', label: 'Metric (kg)' },
          { value: 'imperial', label: 'Imperial (lb)' },
        ]}
      />
    </View>
  ),
};

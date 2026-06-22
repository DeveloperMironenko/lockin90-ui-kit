import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Toggle } from '../components/Toggle';

const meta = {
  title: 'Native/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: {},
};

export const On: Story = {
  args: { checked: true },
};

export const States: Story = {
  render: () => (
    <View style={{ gap: 14 }}>
      <Toggle label="Email notifications" checked />
      <Toggle label="Push notifications" />
      <Toggle label="Compact mode" size="sm" checked />
      <Toggle label="Beta features" disabled checked />
    </View>
  ),
};

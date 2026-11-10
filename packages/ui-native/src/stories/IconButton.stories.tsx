import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { IconButton } from '../components/IconButton';

const meta = { title: 'Native/IconButton' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <IconButton label="Change photo" icon="camera" />,
};

export const SizesAndStates: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton label="Change photo" icon="camera" />
      <IconButton label="Change photo" icon="camera" size="sm" />
      <IconButton label="Change photo" icon="camera" disabled />
    </View>
  ),
};

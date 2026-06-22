import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Toolbar, Dropzone } from '../components/Toolbar';

const meta = { title: 'Native/Toolbar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Toolbar />
    </View>
  ),
};

export const Upload: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Dropzone />
    </View>
  ),
};

export const UploadCustom: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Dropzone
        label="Drop progress photos"
        hint="HEIC, PNG, JPG up to 25MB"
        onPress={() => {}}
      />
    </View>
  ),
};

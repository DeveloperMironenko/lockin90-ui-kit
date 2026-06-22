import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { VersionBadge } from '../components/VersionBadge';

const meta = { title: 'Native/VersionBadge' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <VersionBadge version="v1.6.0" build="a1b2c3d" env="prod" />
    </View>
  ),
};

export const Environments: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <VersionBadge version="v2.4.0" build="a1b2c3d" env="prod" />
      <VersionBadge version="v2.5.0-rc.3" build="9f0e1d2" env="staging" />
      <VersionBadge version="v2.5.0-dev" build="local" env="dev" />
    </View>
  ),
};

export const WithDate: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <VersionBadge version="v1.6.0" build="a1b2c3d" date="2026-06-21" env="prod" />
    </View>
  ),
};

export const NoDot: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <VersionBadge version="v1.6.0" env="prod" dot={false} />
    </View>
  ),
};

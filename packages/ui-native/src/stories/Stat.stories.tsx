import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Stat } from '../components/Stat';

const meta = { title: 'Native/Stat' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Stat label="Energy" value="76" />,
};

export const Empty: Story = {
  render: () => <Stat label="Energy" value="76" empty hint="No data yet — connect a wearable" />,
};

export const WithDelta: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28 }}>
      <Stat label="Energy" value="76" delta="+4" deltaDir="up" />
      <Stat label="Strain" value="12.4" delta="-1.2" deltaDir="down" />
    </View>
  ),
};

export const Tones: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28 }}>
      <Stat label="Energy" value="76" tone="gradient" sub="last 7 days" />
      <Stat label="Recovery" value="92" tone="mint" />
      <Stat label="Readiness" value="64" valueColor="#FFB020" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 28 }}>
        <Stat label="Small" value="20" size="sm" />
        <Stat label="Medium" value="30" size="md" />
        <Stat label="Large" value="28" size="lg" />
      </View>
      <Stat label="Members" value="12.4k" size="hero" tone="gradient" />
    </View>
  ),
};

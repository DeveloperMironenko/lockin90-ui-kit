import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Stat } from '../components/Stat';

const meta = { title: 'Native/Stat' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Stat label="Energy" value="76" />,
};

export const WithDelta: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28 }}>
      <Stat label="Energy" value="76" delta="+4" deltaDir="up" />
      <Stat label="Strain" value="12.4" delta="-1.2" deltaDir="down" />
    </View>
  ),
};

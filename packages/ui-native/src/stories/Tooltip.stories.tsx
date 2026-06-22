import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Tooltip } from '../components/Tooltip';
import { Button } from '../components/Button';

const meta = { title: 'Native/Tooltip' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip content="Estimated 1-rep max">
      <Button title="Press me" />
    </Tooltip>
  ),
};

export const Badge: Story = {
  render: () => <Tooltip content="What does this mean?" />,
};

export const Placements: Story = {
  render: () => (
    <View style={{ gap: 56, padding: 56, alignItems: 'flex-start' }}>
      <Tooltip content="Top" placement="top">
        <Button title="Top" />
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button title="Bottom" />
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <Button title="Left" />
      </Tooltip>
      <Tooltip placement="right" content={<Text style={{ color: '#fff', fontSize: 12 }}>Rich node</Text>}>
        <Button title="Right" />
      </Tooltip>
    </View>
  ),
};

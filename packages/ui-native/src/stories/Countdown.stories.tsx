import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Countdown } from '../components/Countdown';

const meta = { title: 'Native/Countdown' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 12 }}>
      <Countdown parts={{ days: 12, hours: 7, minutes: 41, seconds: 9 }} highlightUnit="minutes" />
    </View>
  ),
};

export const Live: Story = {
  render: () => (
    <View style={{ padding: 12 }}>
      <Countdown to={Date.now() + 1000 * 60 * 60 * 26 + 1000 * 40} highlightUnit="seconds" />
    </View>
  ),
};

export const MaintenanceEta: Story = {
  render: () => (
    <View style={{ padding: 12 }}>
      <Countdown
        parts={{ hours: 0, minutes: 23, seconds: 40 }}
        units={['hours', 'minutes', 'seconds']}
        highlightUnit="minutes"
      />
    </View>
  ),
};

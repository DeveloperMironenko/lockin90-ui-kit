import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { RestTimer } from '../components/RestTimer';

const meta = { title: 'Native/RestTimer' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <RestTimer remainingSec={95} totalSec={150} />,
};

export const WithTransport: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <RestTimer remainingSec={62} totalSec={150} sublabel="Next: Bench Press · set 3 of 5" onSkip={() => {}} />
    </View>
  ),
};

export const WithHrReadout: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <RestTimer
        remainingSec={45}
        totalSec={90}
        sublabel="Next: Incline DB Press"
        onSkip={() => {}}
        trailing={<Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>♥ 128 bpm</Text>}
      />
    </View>
  ),
};

export const Paused: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <RestTimer remainingSec={45} totalSec={90} paused sublabel="Timer held" onSkip={() => {}} />
    </View>
  ),
};

function LiveDemo() {
  const total = 90;
  const [left, setLeft] = useState(total);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : total)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={{ width: 380 }}>
      <RestTimer remainingSec={left} totalSec={total} sublabel="Ticking every second" onSkip={() => setLeft(0)} />
    </View>
  );
}

export const Live: Story = { render: () => <LiveDemo /> };

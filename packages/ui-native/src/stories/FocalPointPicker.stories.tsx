import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { FocalPointPicker, type FocalPoint } from '../components/FocalPointPicker';

const meta = { title: 'Native/FocalPointPicker' } satisfies Meta;
export default meta;

type Story = StoryObj;

const SAMPLE =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80';

function Interactive({ aspect, showGrid }: { aspect?: number; showGrid?: boolean }) {
  const [point, setPoint] = useState<FocalPoint>({ x: 0.5, y: 0.4 });
  return (
    <View style={{ width: 320, gap: 10 }}>
      <FocalPointPicker
        src={SAMPLE}
        value={point}
        onChange={setPoint}
        aspect={aspect}
        showGrid={showGrid}
      />
      <Text style={{ color: '#AAB2C6', fontFamily: 'monospace' }}>
        x: {point.x.toFixed(3)} · y: {point.y.toFixed(3)}
      </Text>
    </View>
  );
}

export const Default: Story = {
  render: () => <Interactive />,
};

export const Portrait: Story = {
  render: () => <Interactive aspect={0.8} />,
};

export const NoGrid: Story = {
  render: () => <Interactive showGrid={false} />,
};

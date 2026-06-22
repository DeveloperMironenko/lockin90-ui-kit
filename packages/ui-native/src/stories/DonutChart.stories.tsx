import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { DonutChart } from '../components/DonutChart';

const meta = { title: 'Native/DonutChart' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** Defaults: 50/30/20 cyan / lime / violet, center shows the summed total. */
export const Default: Story = {
  render: () => <DonutChart />,
};

/** A big score number + label in the center via `children`. */
export const WithCenter: Story = {
  render: () => (
    <DonutChart size={160} thickness={18}>
      <Text style={{ fontSize: 40, lineHeight: 40, color: '#fff' }}>76</Text>
      <Text
        style={{
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        SCORE
      </Text>
    </DonutChart>
  ),
};

export const CustomSegments: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <DonutChart
        segments={[
          { value: 70, color: '#34F5C5', label: 'Done' },
          { value: 30, color: 'rgba(255,255,255,0.12)', label: 'Remaining' },
        ]}
      />
    </View>
  ),
};

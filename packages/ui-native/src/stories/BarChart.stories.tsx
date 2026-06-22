import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { BarChart } from '../components/BarChart';

const meta = {
  title: 'Native/BarChart',
  component: BarChart,
} satisfies Meta<typeof BarChart>;
export default meta;

type Story = StoryObj<typeof BarChart>;

/** Defaults: 7 weekday-style bars, Wed highlighted (mint), Sat in zone-mid. */
export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart />
    </View>
  ),
};

/** Bars only, no value labels above. */
export const NoValues: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart showValues={false} />
    </View>
  ),
};

export const CustomBars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart
        bars={[
          { value: 40, label: 'Q1' },
          { value: 62, label: 'Q2' },
          { value: 88, label: 'Q3', highlight: true },
          { value: 55, label: 'Q4' },
        ]}
      />
    </View>
  ),
};

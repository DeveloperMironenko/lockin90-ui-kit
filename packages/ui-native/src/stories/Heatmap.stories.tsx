import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Heatmap, type HeatmapCell } from '../components/Heatmap';

const meta = { title: 'Native/Heatmap' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** A 30-cell compliance strip: 1 = confirmed (mint), 0 = skipped (faint), a couple of skips. */
const STRIP_CELLS: HeatmapCell[] = Array.from({ length: 30 }, (_, i) => ({
  value: i === 3 || i === 12 ? 0 : 1,
}));

export const Default: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap />
    </View>
  ),
};

export const CalendarGrid: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap columns={7} cellSize={40} gap={8} />
    </View>
  ),
};

export const ContributionStrip: Story = {
  render: () => (
    <View style={{ width: 320, padding: 8 }}>
      <Text style={{ color: '#fff', marginBottom: 8 }}>30-day compliance</Text>
      <Heatmap
        variant="strip"
        columns={30}
        cellSize={22}
        gap={3}
        cells={STRIP_CELLS}
        colorFrom="#11151F"
        colorTo="#34F5C5"
      />
    </View>
  ),
};

export const ZoneScale: Story = {
  render: () => (
    <View style={{ width: 320, padding: 8 }}>
      <Heatmap
        variant="strip"
        columns={17}
        cellSize={30}
        gap={3}
        cells={Array.from({ length: 17 }, (_, i) => ({ value: i / 16 }))}
        colorScale={(v) =>
          v < 0.4
            ? `rgba(255,77,109,${0.45 + v})`
            : v < 0.7
              ? `rgba(255,176,32,${0.4 + v * 0.5})`
              : `rgba(52,245,197,${0.3 + v * 0.7})`
        }
      />
    </View>
  ),
};

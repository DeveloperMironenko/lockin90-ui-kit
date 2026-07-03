import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Gauge } from '../components/Gauge';
import { colors } from '@lockin90/tokens';

const meta = { title: 'Native/Gauge' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge value={78} label="ENERGY" />
    </View>
  ),
};

export const Zones: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge
        value={78}
        label="TODAY"
        zones={[
          { to: 34, color: colors.zoneLow },
          { to: 67, color: colors.zoneMid },
          { to: 100, color: colors.zoneHigh },
        ]}
      />
    </View>
  ),
};

export const Ticks: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge value={64} label="SCORE" ticks={7} />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ padding: 16, flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <Gauge size={96} value={38} thickness={8} sweep={180} label="LOW" />
      <Gauge size={130} value={64} thickness={11} label="MID" />
      <Gauge
        size={170}
        value={88}
        thickness={16}
        label="HIGH"
        zones={[
          { to: 34, color: colors.zoneLow },
          { to: 67, color: colors.zoneMid },
          { to: 100, color: colors.zoneHigh },
        ]}
      />
    </View>
  ),
};

/* ---- catalog reproductions (donut-charts DN-13 / DN-14) ------------------ */

/** DN-13 gauge-270 — 270° gauge (opens down) · red→amber→green arc · 5 ticks. */
export const DN13Gauge270: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge
        value={62}
        size={150}
        thickness={11}
        sweep={270}
        gradient={[colors.zoneLow, colors.zoneMid, colors.zoneHigh]}
        ticks={5}
        tickPosition="out"
        cap={false}
        label="STRAIN"
      />
    </View>
  ),
};

/** DN-14 half-gauge — 180° semicircle · round caps · stat under the arc. */
export const DN14HalfGauge: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge
        value={44}
        size={140}
        thickness={12}
        sweep={180}
        color={colors.cyan}
        cap={false}
        label="HYDRATION"
      />
    </View>
  ),
};

/** Zone verdict coloring — arc + readout track the value's zone. */
export const ZoneVerdict: Story = {
  render: () => (
    <View style={{ padding: 16, flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <Gauge value={24} zone label="LOW" size={120} />
      <Gauge value={52} zone label="MID" size={120} />
      <Gauge value={81} zone label="HIGH" size={120} shine />
    </View>
  ),
};

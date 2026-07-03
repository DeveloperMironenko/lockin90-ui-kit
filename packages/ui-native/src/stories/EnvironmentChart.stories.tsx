import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { EnvironmentChart } from '../components/EnvironmentChart';

/* Story data reproduces the environment catalog cards
   (lockin90-design/charts/environment-charts.html · EN-01…EN-04) — the page's
   fixed hourly arrays (UV16 / POL16 / AQI16 + the pollen rows) and sun times
   (05:47 → 21:12), so parity vs the design page — and the web twin — is
   verifiable by eye. */

/** The catalog's hourly demo arrays (6:00 → 22:00, 16 cells). */
const UV16 = [0, 0.05, 0.15, 0.3, 0.5, 0.75, 0.9, 1, 0.95, 0.8, 0.6, 0.4, 0.22, 0.1, 0.02, 0];
const POL16 = [0.2, 0.3, 0.45, 0.7, 0.9, 0.95, 0.9, 0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1];
const AQI16 = [0.3, 0.35, 0.5, 0.6, 0.55, 0.5, 0.45, 0.4, 0.42, 0.38, 0.3, 0.25, 0.2, 0.2, 0.25, 0.3];
const TREE16 = [0.5, 0.6, 0.7, 0.75, 0.7, 0.6, 0.5, 0.45, 0.4, 0.3, 0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
const GRASS16 = [0.3, 0.4, 0.55, 0.75, 0.9, 1, 0.95, 0.85, 0.6, 0.45, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
const WEED16 = [0.15, 0.2, 0.2, 0.3, 0.35, 0.4, 0.4, 0.35, 0.3, 0.3, 0.25, 0.2, 0.15, 0.15, 0.1, 0.1];

const meta = { title: 'Native/EnvironmentChart' } satisfies Meta;
export default meta;

/** EN-01 sun-uv-arc — sun path sunrise→sunset, UV-colored segments + NOW
 *  marker (static dot + halo on native — the web SMIL pulse is a substrate
 *  diff) + horizon times + PEAK pill. The card's pills are hardcoded on the
 *  page — passed here as overrides; omit them for the computed defaults. */
export const EN01SunUvArc: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EnvironmentChart
        sunrise={5.78}
        sunset={21.2}
        now={14}
        peakUv={7}
        nowLabel="NOW · UV 5"
        peak="UV 7 PEAK · 13:00"
      />
    </View>
  ),
};

/** EN-02 pollen-rows — 3 hourly cell rows (tree/grass/weed), brightness +
 *  color = load, worst window flagged. */
export const EN02PollenRows: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EnvironmentChart
        variant="pollen-rows"
        tree={TREE16}
        grass={GRASS16}
        weed={WEED16}
        flag="GRASS HIGH 10–14"
      />
    </View>
  ),
};

/** EN-03 aqi-day — stepped AQI curve + area, dashed MODERATE rule + NOW
 *  marker with verdict pill (computed: 'AQI 42 · GOOD' at 14:00). */
export const EN03AqiDay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EnvironmentChart variant="aqi-day" aqi={AQI16} now={14} />
    </View>
  ),
};

/** EN-04 outdoor-window — UV + pollen + air rows stacked + the computed mint
 *  BEST WINDOW box where all three are low (17:00–19:30). */
export const EN04OutdoorWindow: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EnvironmentChart
        variant="outdoor-window"
        uv={UV16}
        pollen={POL16}
        air={AQI16}
        windowStart={17}
        windowEnd={19.5}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate segments (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EnvironmentChart nowLabel="NOW · UV 5" peak="UV 7 PEAK · 13:00" shine />
    </View>
  ),
};

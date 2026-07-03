import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
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

/* ----------------------------------------------------------------------------
   Catalog variants — each story reproduces the design-catalog card
   (lockin90-design/charts/bar-charts.html) on the 320px card width.
   -------------------------------------------------------------------------- */

const toBars = (vals: number[]) => vals.map((value) => ({ value }));

const WAVE12 = [58, 72, 81, 76, 63, 49, 42, 51, 66, 78, 83, 74];
const WAVE7 = [64, 78, 85, 72, 58, 66, 80];
const WAVE24 = [44, 52, 61, 70, 76, 79, 74, 66, 57, 49, 45, 48, 55, 63, 71, 78, 82, 80, 73, 64, 56, 51, 54, 62];
const NOISY12 = [70, 45, 24, 66, 81, 35, 55, 74, 29, 62, 48, 86];
const TIDE12 = [62, 55, 44, 70, 38, 58, 47, 66, 30, 53, 61, 42];
const CAPS8 = [52, 66, 78, 71, 58, 49, 62, 74];
const MICRO16 = [40, 55, 62, 48, 70, 66, 52, 45, 58, 72, 64, 50, 61, 75, 68, 80];
const LEVELS10 = [42, 38, 50, 58, 54, 61, 57, 66, 72, 68];
const DEEP12 = [38, 45, 50, 46, 40, 34, 30, 35, 42, 48, 52, 46];
const LIGHT12 = [25, 30, 33, 31, 27, 23, 20, 23, 28, 32, 35, 31];
const PRO12 = [29, 34, 38, 35, 30, 26, 23, 27, 32, 36, 39, 35];
const CARB12 = [21, 25, 28, 26, 22, 19, 17, 20, 23, 26, 29, 26];
const FAT12 = [14, 17, 19, 17, 15, 13, 11, 13, 16, 18, 19, 17];
const LASTWK12 = [50, 61, 70, 74, 68, 56, 47, 44, 55, 65, 72, 78];

/** BC-01 `bars` — rounded rx3 bars, default mint. */
export const BC01Bars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="bars" title="ENERGY · LAST 12 DAYS" bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-01 SELECTs — color token / vertical gradient / glass 14% / density 7→24 / shine. */
export const BC01ColorGradientGlassDensity: Story = {
  render: () => (
    <View style={{ width: 320, gap: 20 }}>
      <BarChart variant="bars" title="COLOR · CYAN" color={colors.cyan} bars={toBars(WAVE12)} max={100} />
      <BarChart variant="bars" title="VERTICAL GRADIENT" gradientStops={[colors.cyan, colors.accent]} bars={toBars(WAVE12)} max={100} />
      <BarChart variant="bars" title="GLASS 14%" glass bars={toBars(WAVE12)} max={100} />
      <BarChart variant="bars" title="DENSITY · 7 WIDE BLOCKS" bars={toBars(WAVE7)} max={100} />
      <BarChart variant="bars" title="DENSITY · 24 THIN STICKS" bars={toBars(WAVE24)} max={100} />
      <BarChart variant="bars" title="SHINE" shine bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-04 `spectrum-bars` — each bar hued by x-position (lime→magenta). */
export const BC04SpectrumBars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="spectrum-bars" title="ENERGY · LAST 12 DAYS" bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-05 `zone-bars` — bar color = value zone (≥62 mint · ≥38 amber · else coral). */
export const BC05ZoneBars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="zone-bars" title="ENERGY · LAST 12 DAYS" bars={toBars(NOISY12)} max={100} />
    </View>
  ),
};

/** BC-08 `lollipop` — 2px stem + 3.4px head dot, cyan. */
export const BC08Lollipop: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="lollipop" title="WEIGH-INS · LAST 12" bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-11 `diverging-tide` — ± around the 50% midline (mint above / coral below). */
export const BC11DivergingTide: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart
        variant="diverging-tide"
        title="NET EFFECT · LAST 12 DAYS"
        bars={toBars(TIDE12)}
        max={100}
        legend={[
          { label: 'ABOVE', color: colors.mint },
          { label: 'BELOW', color: colors.zoneLow },
        ]}
      />
    </View>
  ),
};

/** BC-12 `stacked` — 2 & 3 segments; outer corners rounded, seams square. */
export const BC12Stacked: Story = {
  render: () => (
    <View style={{ width: 320, gap: 20 }}>
      <BarChart
        variant="stacked"
        title="SLEEP MIX · LAST 12 NIGHTS"
        series={[DEEP12, LIGHT12]}
        max={100}
        legend={[
          { label: 'DEEP', color: colors.mint },
          { label: 'LIGHT', color: colors.violet },
        ]}
      />
      <BarChart
        variant="stacked"
        title="MACROS · LAST 12 DAYS"
        series={[PRO12, CARB12, FAT12]}
        max={100}
        legend={[
          { label: 'PRO', color: colors.mint },
          { label: 'CARB', color: colors.violet },
          { label: 'FAT', color: colors.cyan },
        ]}
      />
    </View>
  ),
};

/** BC-14 `grouped-pair` — two series side-by-side (mint vs violet 85%). */
export const BC14GroupedPair: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart
        variant="grouped-pair"
        title="ENERGY · WEEK VS WEEK"
        series={[WAVE12, LASTWK12]}
        max={100}
        legend={[
          { label: 'THIS WK', color: colors.mint },
          { label: 'LAST WK', color: colors.violet },
        ]}
      />
    </View>
  ),
};

/** BC-15 `value-caps` — mono value labels above every 2nd bar (n≤10). */
export const BC15ValueCaps: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="value-caps" title="ENERGY · LAST 8 DAYS" color={colors.cyan} bars={toBars(CAPS8)} max={100} />
    </View>
  ),
};

/** BC-16 `fade-history` — opacity ramps 25%→100% toward newest. */
export const BC16FadeHistory: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="fade-history" title="ENERGY · LAST 12 DAYS" bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-17 `today-pulse` — all bars 30% except today 100% + dot above (static ring on native). */
export const BC17TodayPulse: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="today-pulse" title="ENERGY · LAST 12 DAYS" bars={toBars(WAVE12)} max={100} />
    </View>
  ),
};

/** BC-18 `rank-rows` — horizontal ranked pills, spectrum order, mono row labels. */
export const BC18RankRows: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart
        variant="rank-rows"
        title="TOP FACTORS · 30D"
        bars={[
          { value: 92, label: 'SLEEP' },
          { value: 81, label: 'TRAINING' },
          { value: 74, label: 'NUTRITION' },
          { value: 62, label: 'SUNLIGHT' },
          { value: 55, label: 'FOCUS' },
          { value: 43, label: 'SOCIAL' },
        ]}
        max={100}
      />
    </View>
  ),
};

/** BC-19 `waterfall` — floating ± steps (mint gain / coral loss) + connector ticks. */
export const BC19Waterfall: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="waterfall" title="SCORE FLOW · TODAY" bars={toBars(LEVELS10)} max={100} waterfallStart={35} />
    </View>
  ),
};

/** BC-20 `goal-bars` — bars + dashed zone-mid GOAL rule at 68%. */
export const BC20GoalBars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="goal-bars" title="ENERGY · LAST 12 DAYS" color={colors.cyan} bars={toBars(WAVE12)} max={100} goal={68} />
    </View>
  ),
};

/** BC-22 `sparkbar-micro` — no grid, 16 micro bars; fits inside stat cards. */
export const BC22SparkbarMicro: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="sparkbar-micro" bars={toBars(MICRO16)} max={100} />
    </View>
  ),
};

/** BC-24 `forecast-bars` — past solid, future outlined dashed, NOW rule between. */
export const BC24ForecastBars: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarChart variant="forecast-bars" title="ENERGY · ACTUAL + PLAN" bars={toBars(WAVE12)} max={100} forecastFrom={7} />
    </View>
  ),
};

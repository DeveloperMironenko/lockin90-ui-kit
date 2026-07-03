import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { CompositeChart } from '../components/CompositeChart';

/* Story data reproduces the composite catalog cards
   (lockin90-design/charts/composite-charts.html · CM-01/03/05/07). The
   component defaults ARE the cards; the deviation story regenerates the
   page's noisy rows with the same ported PRNG — parity vs the design page
   and the web twin is verifiable by eye. */

/** Deterministic PRNG (catalog mulberry32). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** The page's genData('noisy') — the horizon card's vs-baseline series. */
function noisy(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const b = 0.5 + (r() - 0.5) * 0.1;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push(clamp(b + Math.sin(t * Math.PI * 2.2 + r()) * 0.12 + (r() - 0.5) * 0.3));
  }
  return out;
}

const meta = { title: 'Native/CompositeChart' } satisfies Meta;
export default meta;

/** CM-01 treemap — nested rounded rects, 28% fills + tinted borders. */
export const CM01Treemap: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart />
    </View>
  ),
};

/** CM-01 · SELECT coloring `zone` — tile color = share verdict. */
export const CM01ZoneColoring: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart coloring="zone" />
    </View>
  ),
};

/** CM-03 horizon-rows — folded 2-layer bands, 4 metrics × 40 days. */
export const CM03HorizonRows: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart variant="horizon-rows" />
    </View>
  ),
};

/** CM-03 · SELECT mode `deviation` — folded |deviation| vs baseline. */
export const CM03DeviationMode: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart
        variant="horizon-rows"
        mode="deviation"
        rows={[
          { label: 'ENERGY', color: colors.mint, values: noisy(11, 40) },
          { label: 'HRV', color: colors.cyan, values: noisy(22, 40) },
          { label: 'SLEEP', color: colors.violet, values: noisy(33, 40) },
          { label: 'STRAIN', color: colors.zoneMid, values: noisy(44, 40) },
        ]}
      />
    </View>
  ),
};

/** CM-05 calendar-micro — a month grid where every day is a micro
 *  sparkline, zone-colored by its last value. */
export const CM05CalendarMicro: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart variant="calendar-micro" />
    </View>
  ),
};

/** CM-05 · SELECT cell `bars` — 6 zone-colored micro bars per day. */
export const CM05CalendarBars: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart variant="calendar-micro" cell="bars" />
    </View>
  ),
};

/** CM-07 goal-tree — root goal ring (74) + 3 child habit rings with % +
 *  bezier connectors + pills. */
export const CM07GoalTree: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart variant="goal-tree" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate behind the hero tiles
 *  (no blur filters on native). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompositeChart shine />
    </View>
  ),
};

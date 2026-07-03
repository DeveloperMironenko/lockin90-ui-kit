import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { CompareChart, type RankSeries } from '../components/CompareChart';

/* Story data reproduces the compare catalog cards
   (lockin90-design/charts/compare-charts.html · CP-01…CP-07) so parity vs
   the design page — and the web twin — is verifiable by eye. The default
   metrics/series/steps ARE the catalog data. */

/* the catalog bump series (CP-03) — explicit here so the story is self-documenting */
const BUMP_SERIES: RankSeries[] = [
  { name: 'SLEEP', ranks: [1, 1, 2, 1], color: colors.violet },
  { name: 'TRAINING', ranks: [2, 3, 1, 2], color: colors.cyan },
  { name: 'NUTRITION', ranks: [3, 2, 3, 4], color: colors.lime },
  { name: 'STRESS', ranks: [4, 4, 4, 3], color: colors.zoneMid },
];

/* deterministic PRNG (catalog mulberry32) — CP-06 derives its 8 cohort ghost
   slopes from seeds 90+ci, exactly like the catalog page */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const COHORT = Array.from({ length: 8 }, (_, ci) => {
  const rnd = mulberry32(90 + ci);
  return { before: 0.3 + rnd() * 0.4, after: 0.35 + rnd() * 0.4 };
});

const meta = { title: 'Native/CompareChart' } satisfies Meta;
export default meta;

/** CP-01 slope-panel — 2 columns, one slope per metric, signed deltas right. */
export const CP01SlopePanel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart title="DAY 1 → DAY 90" />
    </View>
  ),
};

/** CP-02 dumbbell-rows — dim start → solid end dot pairs + connectors. */
export const CP02DumbbellRows: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart variant="dumbbell-rows" title="WHAT MOVED · 90 DAYS" />
    </View>
  ),
};

/** CP-03 bump-ranks — rank lanes 1–4, smooth rank lines + #rank labels. */
export const CP03BumpRanks: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart variant="bump-ranks" series={BUMP_SERIES} title="FACTOR RANKING · 4 WEEKS" />
    </View>
  ),
};

/** CP-04 delta-arrows — center zero-line, 5px arrow bars + % labels. */
export const CP04DeltaArrows: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart variant="delta-arrows" title="CHANGES VS BASELINE" />
    </View>
  ),
};

/** CP-05 mirror-bars — before (dim) left, after (hued) right of a spine. */
export const CP05MirrorBars: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart variant="mirror-bars" title="DAY 1 | DAY 90" />
    </View>
  ),
};

/** CP-06 cohort-slopes — hero mint slope 3.5px over 8 faint cohort slopes. */
export const CP06CohortSlopes: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart
        variant="cohort-slopes"
        cohort={COHORT}
        badge="ENERGY +26 IN 90 DAYS"
        title="YOUR SLOPE VS COHORT"
      />
    </View>
  ),
};

/** CP-07 ladder-steps — milestone dots climbing, done mint-60%, static NOW halo. */
export const CP07LadderSteps: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart variant="ladder-steps" title="PROGRAM LADDER" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate stroke (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CompareChart shine title="DAY 1 → DAY 90" />
    </View>
  ),
};

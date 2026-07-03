import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { BeeswarmChart } from '../components/BeeswarmChart';

/* The component's default points/groups ARE the catalog demo data (same
   mulberry32 seeds 7 / 11 / 13 / 21 / 22 as the design page), so the stories
   reproduce lockin90-design/charts/beeswarm-charts.html — and the web twin —
   dot-for-dot. */

const meta = { title: 'Native/BeeswarmChart' } satisfies Meta;
export default meta;

/** BW-01 history-swarm — THE training-history overview: 60 sessions along the
 *  duration axis, colored by type, this week ringed white + legend. */
export const BW01HistorySwarm: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart variant="history-swarm" title="ALL WORKOUTS · 60 DAYS" />
    </View>
  ),
};

/** BW-02 score-swarm — daily scores on a 0–100 axis, zone-colored; TODAY
 *  (static halo on native) + derived 'TODAY · 72' pill. */
export const BW02ScoreSwarm: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart variant="score-swarm" title="ENERGY SCORES · 50 DAYS" />
    </View>
  ),
};

/** BW-03 pr-swarm — faint history dots; the PR glows mint (wider faint
 *  duplicate on native) + derived 'PR · 110' pill. */
export const BW03PrSwarm: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart variant="pr-swarm" title="SQUAT SESSIONS" />
    </View>
  ),
};

/** BW-04 month-swarm — two swarms stacked on a shared axis + mean ticks +
 *  derived '+6 MIN AVG' delta pill. */
export const BW04MonthSwarm: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart variant="month-swarm" title="JUN VS MAY" />
    </View>
  ),
};

/** Real-data example — your own sessions, this week ringed. */
export const BW01OwnData: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart
        variant="history-swarm"
        title="RUNS · 30 DAYS"
        points={[28, 42, 35, 61, 55, 47, 33, 72, 66, 58, 44, 39, 52, 63, 70, 48, 36, 57, 64, 41].map((value, i) => ({
          value,
          series: i % 2,
          ring: i >= 17,
        }))}
        seriesLabels={['EASY', 'TEMPO']}
        palette={[colors.cyan, colors.violet]}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate dots (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BeeswarmChart variant="score-swarm" title="ENERGY SCORES · 50 DAYS" shine />
    </View>
  ),
};

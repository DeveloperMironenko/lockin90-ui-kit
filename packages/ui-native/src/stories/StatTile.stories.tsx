import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { StatTile } from '../components/StatTile';

/* Story data reproduces the stat-tile catalog cards
   (lockin90-design/charts/stat-tiles.html · ST-01/06/07/10) plus the draw()
   accessory kinds consolidated into ST-01's SELECT. The component defaults
   carry the catalog's seeded series (spark wave-21 · bars noisy-31 · list
   rows wave-11/12/13) — parity vs the design page and the web twin is
   verifiable by eye. */

const meta = { title: 'Native/StatTile' } satisfies Meta;
export default meta;

/** ST-01 stat-tile — the default KPI tile: big number + delta + caption. */
export const ST01StatTile: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile delta="+6 VS YESTERDAY" label="ENERGY · UPDATED 14:36" />
    </View>
  ),
};

/** ST-01 · SELECT accessory `spark` — 16-pt micro sparkline (HRV card). */
export const ST01SparkAccessory: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile accessory="spark" value="58" delta="−4 · 7D" deltaUp={false} label="HRV MS · LAST 16 DAYS" title="HRV" />
    </View>
  ),
};

/** ST-01 · SELECT accessory `bars` — 8 micro bars (steps card). */
export const ST01BarsAccessory: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile accessory="bars" value="9,4K" delta="+12%" label="STEPS · 8 DAYS" title="STEPS" />
    </View>
  ),
};

/** ST-01 · SELECT accessory `ring` — goal ring at 72% (deep-work card). */
export const ST01GoalRing: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile accessory="ring" value="5.8H" label="DEEP WORK · GOAL 8H" progress={0.72} title="FOCUS" />
    </View>
  ),
};

/** ST-01 · SELECT accessory `progress` — goal progress bar (protein card). */
export const ST01ProgressBar: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile accessory="progress" value="94G" label="PROTEIN · TARGET 130G" progress={0.72} title="PROTEIN" />
    </View>
  ),
};

/** ST-01 · the optional verdict glow-dot — amber dot (halo = wider faint
 *  duplicate on native) + colored number + RECOVERY DAY tag. */
export const ST01VerdictDot: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile value="34" verdictColor={colors.zoneMid} label="READINESS · TAKE IT EASY" pill="RECOVERY DAY" title="READINESS" />
    </View>
  ),
};

/** ST-06 hero-number — centered 52px number + delta + insight line. */
export const ST06HeroNumber: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile variant="hero-number" />
    </View>
  ),
};

/** ST-07 duo-tile — two stats split by a hairline, each with own delta. */
export const ST07DuoTile: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile variant="duo-tile" />
    </View>
  ),
};

/** ST-10 stat-list — 3 rows: label + bold value + colored mini-spark. */
export const ST10StatList: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile variant="stat-list" />
    </View>
  ),
};

/** The catalog glow modifier — mint hero number + wider faint duplicate
 *  behind it (no blur filters on native). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <StatTile variant="hero-number" shine />
    </View>
  ),
};

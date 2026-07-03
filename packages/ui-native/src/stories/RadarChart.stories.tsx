import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { RadarChart } from '../components/RadarChart';

/* Story data reproduces the radar catalog cards
   (lockin90-design/charts/radar-charts.html · RD-01…RD-07) via the page's
   own vals() generator + seeds, so parity vs the design page — and the web
   twin — is verifiable by eye. */

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

/** The page's vals(seed) — five axis values in the 0.35–0.95 band. */
function vals(seed: number): number[] {
  const r = mulberry32(seed);
  return Array.from({ length: 5 }, () => 0.35 + r() * 0.6);
}

const meta = { title: 'Native/RadarChart' } satisfies Meta;
export default meta;

/** RD-01 balance-radar — 5 axes, pentagon grid, fill+edge+vertex dots · the balance-wheel hero. */
export const RD01BalanceRadar: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart values={vals(11)} score="72 BALANCED" title="BODY BALANCE · THIS WEEK" />
    </View>
  ),
};

/** RD-01 fill SELECT `gradient` — mint→violet edge over an accent 13% fill. */
export const RD01GradientFill: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart
        values={vals(11)}
        fillStyle="gradient"
        score="72 BALANCED"
        title="BODY BALANCE · THIS WEEK"
      />
    </View>
  ),
};

/** RD-02 target-overlay — mint shape over the dashed violet 80% target pentagon + YOU/TARGET pills. */
export const RD02TargetOverlay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart variant="target-overlay" values={vals(22)} title="YOU VS TARGET" />
    </View>
  ),
};

/** RD-03 cohort-ghost — mint shape + text-35% dashed cohort ghost (the card's seed+7 · ×0.85). */
export const RD03CohortGhost: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart
        variant="cohort-ghost"
        values={vals(33)}
        compare={vals(40).map((v) => v * 0.85)}
        title="YOU VS COHORT"
      />
    </View>
  ),
};

/** RD-04 zone-vertices — neutral text-40% shape · vertex dots colored by value zone. */
export const RD04ZoneVertices: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart variant="zone-vertices" values={vals(44)} title="FACTOR HEALTH" />
    </View>
  ),
};

/** RD-06 weeks-trail — 3 overlays W1→W3, opacity 30→100% — the shape expanding. */
export const RD06WeeksTrail: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart
        variant="weeks-trail"
        trail={[vals(66).map((v) => v * 0.7), vals(69).map((v) => v * 0.85), vals(72)]}
        title="BALANCE GROWING · 3 WEEKS"
      />
    </View>
  ),
};

/** RD-07 mini-triples — 3 small radars (R30, no labels) + day captions. */
export const RD07MiniTriples: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart
        variant="mini-triples"
        series={[
          { values: vals(11), label: 'MON' },
          { values: vals(22), label: 'TUE' },
          { values: vals(33), label: 'WED' },
        ]}
        title="BALANCE · 3 DAYS"
      />
    </View>
  ),
};

/** The catalog glow modifier — a wider faint duplicate edge (no filters on native). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <RadarChart values={vals(11)} score="72 BALANCED" shine title="BODY BALANCE · THIS WEEK" />
    </View>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { SupplementChart } from '../components/SupplementChart';

/* Story data reproduces the supplement catalog cards
   (lockin90-design/charts/supplement-charts.html · SP-01…SP-10) so parity
   vs the design page — and the web twin — is verifiable by eye; the
   component defaults ARE the catalog's synthetic series. */

const meta = { title: 'Native/SupplementChart' } satisfies Meta;
export default meta;

/** SP-01 saturation-story — SATURATED → MISSED×3 → rebuild + today pulse. */
export const SP01SaturationStory: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart title="CREATINE · 5G DAILY" stat="LVL 78%" statColor={colors.mint} />
    </View>
  ),
};

/** SP-02 active-stack — 4 rows: name + level bar + % + status pill. */
export const SP02ActiveStack: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="active-stack" title="ACTIVE SUPPLEMENTS" />
    </View>
  ),
};

/** SP-03 half-life — exponential decay from the dose tag + NOW pulse + pill. */
export const SP03HalfLife: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart
        variant="half-life"
        title="CAFFEINE · HALF-LIFE 5H"
        doseLabel="DOSE 200 MG · 9:30"
        nowNote="STILL ACTIVE · 84 MG"
      />
    </View>
  ),
};

/** SP-04 dose-level — dose dots + faint intake stems + resulting level line. */
export const SP04DoseLevel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="dose-level" title="MAGNESIUM · 2 WEEKS" kUp={0.3} kDown={0.2} />
    </View>
  ),
};

/** SP-05 depletion-forecast — solid past · dashed projection · restock pulse. */
export const SP05DepletionForecast: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="depletion-forecast" title="IF YOU STOP TODAY" />
    </View>
  ),
};

/** SP-06 adherence-level — taken/missed cells + the resulting cyan level line. */
export const SP06AdherenceLevel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="adherence-level" title="PROTOCOL ADHERENCE" kUp={0.3} kDown={0.2} note="LEVEL 74%" />
    </View>
  ),
};

/** SP-07 stack-levels — three kinetics: slow build · mid · sawtooth dashed. */
export const SP07StackLevels: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="stack-levels" title="THE STACK · 14 DAYS" />
    </View>
  ),
};

/** SP-09 liquid-batteries — 5 glass vessels: wavy liquid + bubbles + zone
 *  fill + % (inverts when submerged) + names under. */
export const SP09LiquidBatteries: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="liquid-batteries" title="THE STACK · TANK LEVELS" />
    </View>
  ),
};

/** SP-10 battery-hero — one large 56px vessel + FULL/LOW ticks + stats. */
export const SP10BatteryHero: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart variant="battery-hero" title="CREATINE · TANK" shine />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate stroke (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SupplementChart title="CREATINE · 5G DAILY" stat="LVL 78%" statColor={colors.mint} shine />
    </View>
  ),
};

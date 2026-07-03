import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { MetaphorWidget } from '../components/MetaphorWidget';

/* Story data reproduces the metaphor catalog cards
   (lockin90-design/charts/metaphor-charts.html · MT-01/03/05/06/07/09/10/11/12).
   The component defaults ARE the cards, so most stories just pick a variant —
   parity vs the design page (and the web twin) is verifiable by eye. */

const meta = { title: 'Native/MetaphorWidget' } satisfies Meta;
export default meta;

/** MT-01 thermometer — glass tube + bulb · liquid column = value
 *  (cyan→amber→coral) · the defaults are the card (level 0.62 → amber). */
export const MT01Thermometer: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget />
    </View>
  ),
};

/** MT-01 with the TARGET tick — the SELECT the card documents. */
export const MT01TargetTick: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget target={0.8} targetLabel="LIMIT 18" />
    </View>
  ),
};

/** MT-03 fasting-hourglass — amber sand top = remaining, bottom = elapsed +
 *  falling stream + countdown + pill. */
export const MT03FastingHourglass: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="fasting-hourglass" />
    </View>
  ),
};

/** MT-05 habit-garden — 6 plants: growth stage = streak weeks (sprout →
 *  bloom), wilted coral = broken. */
export const MT05HabitGarden: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="habit-garden" />
    </View>
  ),
};

/** MT-06 plant-stages — the garden legend: 5 growth stages in a row +
 *  your-plant pill. */
export const MT06PlantStages: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="plant-stages" />
    </View>
  ),
};

/** MT-07 mountain-route — indigo mountain profile + veil fill · camp flags
 *  D30/D60 + lime SUMMIT D90 · YOU marker at day 56 (static dot + halo on
 *  native — the web SMIL pulse is a substrate diff). */
export const MT07MountainRoute: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="mountain-route" />
    </View>
  ),
};

/** MT-09 hydration-bottle — fills UP through the day: cyan liquid + wave +
 *  bubbles + 8 glass ticks + next-glass pill. */
export const MT09HydrationBottle: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="hydration-bottle" />
    </View>
  ),
};

/** MT-10 meal-plates — day strip of mini macro-donut plates (kcal above,
 *  time under, FAT/CARB/PRO legend). */
export const MT10MealPlates: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="meal-plates" />
    </View>
  ),
};

/** MT-11 breath-pacer — guide rings + cyan orb, static mid-size on native
 *  (the web 19s grow/shrink SVG loop is a substrate diff). */
export const MT11BreathPacer: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="breath-pacer" />
    </View>
  ),
};

/** MT-12 breath-session — breaths/min curve slowing 14 → 7 into the shaded
 *  CALM ZONE + calm-reached pill. */
export const MT12BreathSession: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="breath-session" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate line (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MetaphorWidget variant="mountain-route" shine />
    </View>
  ),
};

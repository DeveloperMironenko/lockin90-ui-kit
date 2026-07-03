import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { MetaphorWidget } from '../components/MetaphorWidget';

/* Story data reproduces the metaphor catalog cards
   (lockin90-design/charts/metaphor-charts.html · MT-01/03/05/06/07/09/10/11/12).
   The component defaults ARE the cards, so most stories just pick a variant —
   parity vs the design page is verifiable by eye. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/MetaphorWidget',
  component: MetaphorWidget,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof MetaphorWidget>;
export default meta;

/** MT-01 thermometer — glass tube + bulb · liquid column = value
 *  (cyan→amber→coral) · the defaults are the card (level 0.62 → amber). */
export const MT01Thermometer: StoryObj<typeof meta> = {
  args: {},
};

/** MT-01 with the TARGET tick — the SELECT the card documents. */
export const MT01TargetTick: StoryObj<typeof meta> = {
  args: { target: 0.8, targetLabel: 'LIMIT 18' },
};

/** MT-03 fasting-hourglass — amber sand top = remaining, bottom = elapsed +
 *  falling stream + countdown + pill. */
export const MT03FastingHourglass: StoryObj<typeof meta> = {
  args: { variant: 'fasting-hourglass' },
};

/** MT-05 habit-garden — 6 plants: growth stage = streak weeks (sprout →
 *  bloom w/ lime glow), wilted coral = broken. */
export const MT05HabitGarden: StoryObj<typeof meta> = {
  args: { variant: 'habit-garden' },
};

/** MT-06 plant-stages — the garden legend: 5 growth stages in a row +
 *  your-plant pill. */
export const MT06PlantStages: StoryObj<typeof meta> = {
  args: { variant: 'plant-stages' },
};

/** MT-07 mountain-route — indigo mountain profile + veil fill · camp flags
 *  D30/D60 + lime SUMMIT D90 · YOU pulse at day 56. */
export const MT07MountainRoute: StoryObj<typeof meta> = {
  args: { variant: 'mountain-route' },
};

/** MT-09 hydration-bottle — fills UP through the day: cyan liquid + wave +
 *  bubbles + 8 glass ticks + next-glass pill. */
export const MT09HydrationBottle: StoryObj<typeof meta> = {
  args: { variant: 'hydration-bottle' },
};

/** MT-10 meal-plates — day strip of mini macro-donut plates (kcal above,
 *  time under, FAT/CARB/PRO legend). */
export const MT10MealPlates: StoryObj<typeof meta> = {
  args: { variant: 'meal-plates' },
};

/** MT-11 breath-pacer — guide rings + cyan orb that GROWS on inhale
 *  (4-7-8 · 19s SVG animate loop). */
export const MT11BreathPacer: StoryObj<typeof meta> = {
  args: { variant: 'breath-pacer' },
};

/** MT-12 breath-session — breaths/min curve slowing 14 → 7 into the shaded
 *  CALM ZONE + calm-reached pill. */
export const MT12BreathSession: StoryObj<typeof meta> = {
  args: { variant: 'breath-session' },
};

/** The catalog glow modifier — blurred line halo on the mountain (and the
 *  thermometer's bulb glow). */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'mountain-route', shine: true },
};

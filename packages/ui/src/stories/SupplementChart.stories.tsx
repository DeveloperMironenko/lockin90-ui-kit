import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { SupplementChart } from '../components/SupplementChart';

/* Story data reproduces the supplement catalog cards
   (lockin90-design/charts/supplement-charts.html · SP-01…SP-10) so parity
   vs the design page is verifiable by eye — the component defaults ARE the
   catalog's synthetic series (creatine story, stack rows, tank levels). */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/SupplementChart',
  component: SupplementChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof SupplementChart>;
export default meta;

/** SP-01 saturation-story — level builds to SATURATED (5 doses) → coral
 *  MISSED×3 window → decays but holds → rebuilds · dose dots · today pulse. */
export const SP01SaturationStory: StoryObj<typeof meta> = {
  args: { title: 'CREATINE · 5G DAILY', stat: 'LVL 78%', statColor: 'var(--mint)' },
};

/** SP-02 active-stack — 4 rows: name + level bar + % + status pill. */
export const SP02ActiveStack: StoryObj<typeof meta> = {
  args: { variant: 'active-stack', title: 'ACTIVE SUPPLEMENTS' },
};

/** SP-03 half-life — exponential decay from the dose tag + NOW pulse + pill. */
export const SP03HalfLife: StoryObj<typeof meta> = {
  args: {
    variant: 'half-life',
    title: 'CAFFEINE · HALF-LIFE 5H',
    doseLabel: 'DOSE 200 MG · 9:30',
    nowNote: 'STILL ACTIVE · 84 MG',
  },
};

/** SP-04 dose-level — dose dots + faint intake stems + resulting level line. */
export const SP04DoseLevel: StoryObj<typeof meta> = {
  args: { variant: 'dose-level', title: 'MAGNESIUM · 2 WEEKS', kUp: 0.3, kDown: 0.2 },
};

/** SP-05 depletion-forecast — solid past · dashed projection · restock pulse. */
export const SP05DepletionForecast: StoryObj<typeof meta> = {
  args: { variant: 'depletion-forecast', title: 'IF YOU STOP TODAY' },
};

/** SP-06 adherence-level — taken/missed cells + the resulting cyan level line. */
export const SP06AdherenceLevel: StoryObj<typeof meta> = {
  args: { variant: 'adherence-level', title: 'PROTOCOL ADHERENCE', kUp: 0.3, kDown: 0.2, note: 'LEVEL 74%' },
};

/** SP-07 stack-levels — creatine slow-build mint · magnesium cyan · caffeine
 *  sawtooth amber dashed + pills. */
export const SP07StackLevels: StoryObj<typeof meta> = {
  args: { variant: 'stack-levels', title: 'THE STACK · 14 DAYS' },
};

/** SP-09 liquid-batteries — 5 glass vessels: wavy liquid + bubbles + zone
 *  fill + % (inverts when submerged) + names under. */
export const SP09LiquidBatteries: StoryObj<typeof meta> = {
  args: { variant: 'liquid-batteries', title: 'THE STACK · TANK LEVELS' },
};

/** SP-10 battery-hero — one large 56px vessel + liquid shine + FULL/LOW
 *  ticks + right stats (78% · SATURATED · holds ~9 days off). */
export const SP10BatteryHero: StoryObj<typeof meta> = {
  args: { variant: 'battery-hero', title: 'CREATINE · TANK', shine: true },
};

/** The catalog glow modifier on the saturation line. */
export const Shine: StoryObj<typeof meta> = {
  args: { title: 'CREATINE · 5G DAILY', stat: 'LVL 78%', statColor: 'var(--mint)', shine: true },
};

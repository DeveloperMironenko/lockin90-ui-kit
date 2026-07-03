import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { StatTile } from '../components/StatTile';

/* Story data reproduces the stat-tile catalog cards
   (lockin90-design/charts/stat-tiles.html · ST-01/06/07/10) plus the draw()
   accessory kinds the page consolidates into ST-01's SELECT (spark / bars /
   ring / progress / verdict dot). The component defaults carry the catalog's
   seeded series (spark wave-21 · bars noisy-31 · list rows wave-11/12/13),
   so parity vs the design page is verifiable by eye. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/StatTile',
  component: StatTile,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof StatTile>;
export default meta;

/** ST-01 stat-tile — the default KPI tile: big number + delta + caption. */
export const ST01StatTile: StoryObj<typeof meta> = {
  args: { delta: '+6 VS YESTERDAY', label: 'ENERGY · UPDATED 14:36' },
};

/** ST-01 · SELECT accessory `spark` — 16-pt micro sparkline (the page's
 *  spark card: HRV 58, seed-21 wave, cyan). */
export const ST01SparkAccessory: StoryObj<typeof meta> = {
  args: {
    accessory: 'spark',
    value: '58',
    delta: '−4 · 7D',
    deltaUp: false,
    label: 'HRV MS · LAST 16 DAYS',
    title: 'HRV',
  },
};

/** ST-01 · SELECT accessory `bars` — 8 micro bars (the page's bars card:
 *  steps 9,4K, seed-31 noisy, mint). */
export const ST01BarsAccessory: StoryObj<typeof meta> = {
  args: {
    accessory: 'bars',
    value: '9,4K',
    delta: '+12%',
    label: 'STEPS · 8 DAYS',
    title: 'STEPS',
  },
};

/** ST-01 · SELECT accessory `ring` — goal ring at 72% (the page's ring
 *  card: deep work 5.8H of 8H). */
export const ST01GoalRing: StoryObj<typeof meta> = {
  args: {
    accessory: 'ring',
    value: '5.8H',
    label: 'DEEP WORK · GOAL 8H',
    progress: 0.72,
    title: 'FOCUS',
  },
};

/** ST-01 · SELECT accessory `progress` — goal progress bar (the page's
 *  goal card: protein 94G of 130G). */
export const ST01ProgressBar: StoryObj<typeof meta> = {
  args: {
    accessory: 'progress',
    value: '94G',
    label: 'PROTEIN · TARGET 130G',
    progress: 0.72,
    title: 'PROTEIN',
  },
};

/** ST-01 · the optional verdict glow-dot — amber dot + colored number +
 *  RECOVERY DAY tag (the page's zone card: readiness 34). */
export const ST01VerdictDot: StoryObj<typeof meta> = {
  args: {
    value: '34',
    verdictColor: 'var(--zone-mid)',
    label: 'READINESS · TAKE IT EASY',
    pill: 'RECOVERY DAY',
    title: 'READINESS',
  },
};

/** ST-06 hero-number — centered 52px number + delta + insight line. */
export const ST06HeroNumber: StoryObj<typeof meta> = {
  args: { variant: 'hero-number' },
};

/** ST-07 duo-tile — two stats split by a hairline, each with own delta. */
export const ST07DuoTile: StoryObj<typeof meta> = {
  args: { variant: 'duo-tile' },
};

/** ST-10 stat-list — 3 rows: label + bold value + colored mini-spark. */
export const ST10StatList: StoryObj<typeof meta> = {
  args: { variant: 'stat-list' },
};

/** The catalog glow modifier — the hero number glows mint (blurred copy). */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'hero-number', shine: true },
};

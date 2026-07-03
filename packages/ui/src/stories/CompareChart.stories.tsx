import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { CompareChart, type RankSeries } from '../components/CompareChart';

/* Story data reproduces the compare catalog cards
   (lockin90-design/charts/compare-charts.html · CP-01…CP-07) so parity vs
   the design page is verifiable by eye. The default metrics/series/steps ARE
   the catalog data, so most stories only pick the variant + title. */

/* the catalog bump series (CP-03) — explicit here so the story is self-documenting */
const BUMP_SERIES: RankSeries[] = [
  { name: 'SLEEP', ranks: [1, 1, 2, 1], color: 'var(--violet)' },
  { name: 'TRAINING', ranks: [2, 3, 1, 2], color: 'var(--cyan)' },
  { name: 'NUTRITION', ranks: [3, 2, 3, 4], color: 'var(--lime)' },
  { name: 'STRESS', ranks: [4, 4, 4, 3], color: 'var(--zone-mid)' },
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

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/CompareChart',
  component: CompareChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof CompareChart>;
export default meta;

/** CP-01 slope-panel — 2 columns, one slope per metric, signed deltas right. */
export const CP01SlopePanel: StoryObj<typeof meta> = {
  args: { title: 'DAY 1 → DAY 90' },
};

/** CP-02 dumbbell-rows — dim start → solid end dot pairs + connectors. */
export const CP02DumbbellRows: StoryObj<typeof meta> = {
  args: { variant: 'dumbbell-rows', title: 'WHAT MOVED · 90 DAYS' },
};

/** CP-03 bump-ranks — rank lanes 1–4, smooth rank lines + #rank labels. */
export const CP03BumpRanks: StoryObj<typeof meta> = {
  args: { variant: 'bump-ranks', series: BUMP_SERIES, title: 'FACTOR RANKING · 4 WEEKS' },
};

/** CP-04 delta-arrows — center zero-line, 5px arrow bars + % labels. */
export const CP04DeltaArrows: StoryObj<typeof meta> = {
  args: { variant: 'delta-arrows', title: 'CHANGES VS BASELINE' },
};

/** CP-05 mirror-bars — before (dim) left, after (hued) right of a spine. */
export const CP05MirrorBars: StoryObj<typeof meta> = {
  args: { variant: 'mirror-bars', title: 'DAY 1 | DAY 90' },
};

/** CP-06 cohort-slopes — hero mint slope 3.5px over 8 faint cohort slopes. */
export const CP06CohortSlopes: StoryObj<typeof meta> = {
  args: {
    variant: 'cohort-slopes',
    cohort: COHORT,
    badge: 'ENERGY +26 IN 90 DAYS',
    title: 'YOUR SLOPE VS COHORT',
  },
};

/** CP-07 ladder-steps — milestone dots climbing, done mint-60%, NOW pulse. */
export const CP07LadderSteps: StoryObj<typeof meta> = {
  args: { variant: 'ladder-steps', title: 'PROGRAM LADDER' },
};

/** The catalog glow modifier — blurred wider duplicate under the slopes. */
export const Shine: StoryObj<typeof meta> = {
  args: { shine: true, title: 'DAY 1 → DAY 90' },
};

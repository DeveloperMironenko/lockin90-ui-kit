import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { DistributionChart, type BoxRow, type RidgeRow } from '../components/DistributionChart';

/* Story data reproduces the distribution catalog cards
   (lockin90-design/charts/distribution-charts.html · DS-01…DS-07) so parity vs
   the design page is verifiable by eye. The component's deterministic default
   sample/rows/ridge ARE the catalog data (mulberry32 seeds 11/21), so most
   stories only pick the variant + the card's title. */

/* the catalog box rows (DS-04) — explicit here so the story is self-documenting */
const BOX_ROWS: BoxRow[] = [
  { name: 'ENERGY', min: 0.3, q1: 0.45, median: 0.58, q3: 0.7, max: 0.88, color: 'var(--mint)' },
  { name: 'HRV', min: 0.2, q1: 0.38, median: 0.5, q3: 0.62, max: 0.8, color: 'var(--cyan)' },
  { name: 'SLEEP', min: 0.35, q1: 0.5, median: 0.62, q3: 0.72, max: 0.85, color: 'var(--violet)' },
  { name: 'STRAIN', min: 0.1, q1: 0.3, median: 0.42, q3: 0.58, max: 0.9, color: 'var(--zone-mid)' },
];

/* the catalog week ridges (DS-07) — four gaussians drifting right */
const RIDGE: RidgeRow[] = [
  { label: 'W1', bell: { mu: 0.4, sigma: 0.16 } },
  { label: 'W2', bell: { mu: 0.47, sigma: 0.16 } },
  { label: 'W3', bell: { mu: 0.54, sigma: 0.16 } },
  { label: 'W4', bell: { mu: 0.61, sigma: 0.16 } },
];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/DistributionChart',
  component: DistributionChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof DistributionChart>;
export default meta;

/** DS-01 histogram — 14 mint bins, opacity scales with count, 40…100 axis. */
export const DS01Histogram: StoryObj<typeof meta> = {
  args: { title: 'ENERGY SCORES · 90 DAYS' },
};

/** DS-02 bell-percentile — cyan bell + veil fill, mint YOU rule + P82 pill. */
export const DS02BellPercentile: StoryObj<typeof meta> = {
  args: {
    variant: 'bell-percentile',
    title: 'WHERE YOU SIT',
    caption: 'HRV DISTRIBUTION · YOUR 90 DAYS',
  },
};

/** DS-03 cohort-bells — violet your-curve vs dashed cohort curve + pills. */
export const DS03CohortBells: StoryObj<typeof meta> = {
  args: { variant: 'cohort-bells', title: 'YOU VS COHORT' },
};

/** DS-04 box-rows — 4 horizontal box-whisker rows, IQR box + median + caps. */
export const DS04BoxRows: StoryObj<typeof meta> = {
  args: { variant: 'box-rows', rows: BOX_ROWS, title: 'METRIC RANGES · 30D' },
};

/** DS-05 violin — symmetric violet→cyan KDE violin (bimodal) + MEDIAN pill. */
export const DS05Violin: StoryObj<typeof meta> = {
  args: { variant: 'violin', title: 'ENERGY SHAPE' },
};

/** DS-07 ridgeline — 4 stacked week-curves, opacity ramps to newest + pill. */
export const DS07Ridgeline: StoryObj<typeof meta> = {
  args: { variant: 'ridgeline', ridge: RIDGE, title: 'DISTRIBUTION DRIFT · 4 WEEKS' },
};

/** Raw samples — the bell + YOU rule derived from real values in a domain. */
export const FromRawValues: StoryObj<typeof meta> = {
  args: {
    variant: 'bell-percentile',
    values: [52, 58, 61, 63, 64, 66, 67, 68, 70, 71, 73, 75, 78, 82, 88],
    xRange: [40, 100],
    percentile: 0.64,
    youLabel: 'YOU · P64',
    title: 'SLEEP SCORES · 30 DAYS',
  },
};

/** The catalog glow modifier — blurred bell underlay + pulsing YOU dot. */
export const Shine: StoryObj<typeof meta> = {
  args: {
    variant: 'bell-percentile',
    shine: true,
    title: 'WHERE YOU SIT',
    caption: 'HRV DISTRIBUTION · YOUR 90 DAYS',
  },
};

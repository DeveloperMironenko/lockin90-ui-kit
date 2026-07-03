import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { BeeswarmChart } from '../components/BeeswarmChart';

/* The component's default points/groups ARE the catalog demo data (same
   mulberry32 seeds 7 / 11 / 13 / 21 / 22 as the design page), so the stories
   reproduce lockin90-design/charts/beeswarm-charts.html dot-for-dot — parity
   is verifiable by eye. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/BeeswarmChart',
  component: BeeswarmChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof BeeswarmChart>;
export default meta;

/** BW-01 history-swarm — THE training-history overview: 60 sessions along the
 *  duration axis, colored by type (strength violet / cardio cyan / mobility
 *  lime), this week ringed white + legend. */
export const BW01HistorySwarm: StoryObj<typeof meta> = {
  args: { variant: 'history-swarm', title: 'ALL WORKOUTS · 60 DAYS' },
};

/** BW-02 score-swarm — daily scores on a 0–100 axis, zone-colored; TODAY
 *  pulses with a derived 'TODAY · 72' pill — you vs your own history. */
export const BW02ScoreSwarm: StoryObj<typeof meta> = {
  args: { variant: 'score-swarm', title: 'ENERGY SCORES · 50 DAYS' },
};

/** BW-03 pr-swarm — all sessions as faint white dots; the PR glows mint with
 *  a derived 'PR · 110' pill — one hero dot. */
export const BW03PrSwarm: StoryObj<typeof meta> = {
  args: { variant: 'pr-swarm', title: 'SQUAT SESSIONS' },
};

/** BW-04 month-swarm — two swarms stacked on a shared axis (this month mint /
 *  last faint) + mean ticks + derived '+6 MIN AVG' delta pill. */
export const BW04MonthSwarm: StoryObj<typeof meta> = {
  args: { variant: 'month-swarm', title: 'JUN VS MAY' },
};

/** Real-data example — your own sessions, this week ringed. */
export const BW01OwnData: StoryObj<typeof meta> = {
  args: {
    variant: 'history-swarm',
    title: 'RUNS · 30 DAYS',
    points: [28, 42, 35, 61, 55, 47, 33, 72, 66, 58, 44, 39, 52, 63, 70, 48, 36, 57, 64, 41].map((value, i) => ({
      value,
      series: i % 2,
      ring: i >= 17,
    })),
    seriesLabels: ['EASY', 'TEMPO'],
    palette: ['var(--cyan)', 'var(--violet)'],
  },
};

/** The catalog glow modifier — soft underlay behind every dot. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'score-swarm', title: 'ENERGY SCORES · 50 DAYS', shine: true },
};

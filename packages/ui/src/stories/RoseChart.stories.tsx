import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { RoseChart, type RosePetal } from '../components/RoseChart';

/* Story data reproduces the rose catalog cards
   (lockin90-design/charts/rose-charts.html · RS-01…RS-03) — the page's CATS
   life-balance scores, DAYS week scores and LAST ghost values, so parity vs
   the design page is verifiable by eye. */

/** The page's CATS — six life-balance petals (RS-01 + RS-03 this week). */
const BALANCE: RosePetal[] = [
  { label: 'TRAIN', value: 0.85 },
  { label: 'SLEEP', value: 0.7 },
  { label: 'FOOD', value: 0.9 },
  { label: 'MIND', value: 0.5 },
  { label: 'SOCIAL', value: 0.6 },
  { label: 'RECOVER', value: 0.75 },
];
/** The page's DAYS — seven day petals (RS-02), Monday → Sunday. */
const WEEK: RosePetal[] = [
  { label: 'M', value: 0.6 },
  { label: 'T', value: 0.75 },
  { label: 'W', value: 0.5 },
  { label: 'T', value: 0.8 },
  { label: 'F', value: 0.65 },
  { label: 'S', value: 0.9 },
  { label: 'S', value: 0.7 },
];
/** The page's LAST — last week's dashed ghost values (RS-03). */
const LAST_WEEK = [0.6, 0.8, 0.7, 0.65, 0.45, 0.6];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/RoseChart',
  component: RoseChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof RoseChart>;
export default meta;

/** RS-01 balance-rose — 6 spectrum petals, length = score, ring guides + labels · the weak petal is obvious. */
export const RS01BalanceRose: StoryObj<typeof meta> = {
  args: { petals: BALANCE, note: 'MIND LAGS · 50%' },
};

/** RS-02 week-rose — 7 mint day-petals, opacity by score, today solid + day letters around. */
export const RS02WeekRose: StoryObj<typeof meta> = {
  args: { variant: 'week-rose', petals: WEEK },
};

/** RS-03 rose-compare — violet filled petals (this week) over white dashed outlines (last week). */
export const RS03RoseCompare: StoryObj<typeof meta> = {
  args: { variant: 'rose-compare', petals: BALANCE, compare: LAST_WEEK },
};

/** The catalog glow modifier — blurred petal duplicates under the balance rose. */
export const Shine: StoryObj<typeof meta> = {
  args: { petals: BALANCE, note: 'MIND LAGS · 50%', shine: true },
};

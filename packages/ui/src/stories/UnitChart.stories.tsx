import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { UnitChart } from '../components/UnitChart';

/* Story data reproduces the unit-chart catalog cards
   (lockin90-design/charts/unit-charts.html · UN-01…UN-05) so parity vs the
   design page is verifiable by eye — same counts, shares and rows. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/UnitChart',
  component: UnitChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof UnitChart>;
export default meta;

/** UN-01 waffle-90 — THE program waffle: 90 dots (15×6), filled mint ramps
 *  toward today, lime TODAY pulse + caption. Stat '62%' derives from done/total. */
export const UN01Waffle90: StoryObj<typeof meta> = {
  args: { variant: 'waffle-90', total: 90, done: 56, title: '90-DAY LOCK-IN' },
};

/** UN-02 waffle-share — 10×10 squares partitioned by zone colors + dot legend. */
export const UN02WaffleShare: StoryObj<typeof meta> = {
  args: {
    variant: 'waffle-share',
    title: 'DAY QUALITY · 100 DAYS',
    segments: [
      { label: 'GOOD', value: 52 },
      { label: 'OK', value: 31 },
      { label: 'ROUGH', value: 17 },
    ],
  },
};

/** UN-03 pictogram-rows — icon tallies (dumbbell/moon/cup), done vs remaining 18%. */
export const UN03PictogramRows: StoryObj<typeof meta> = {
  args: {
    variant: 'pictogram-rows',
    title: 'THIS WEEK · UNITS',
    rows: [
      { label: 'TRAINING', total: 5, done: 3, icon: 'dumbbell' },
      { label: 'SLEEP 8H+', total: 7, done: 5, icon: 'moon' },
      { label: 'NO-CAFF DAYS', total: 7, done: 4, icon: 'cup' },
    ],
  },
};

/** UN-04 day-dots — 7 big dots · done = mint + dark check · pending outline
 *  + day letters + derived '5 OF 7 · ON TRACK' pill. */
export const UN04DayDots: StoryObj<typeof meta> = {
  args: {
    variant: 'day-dots',
    title: 'HABIT · THIS WEEK',
    days: [true, true, true, true, true, false, false],
  },
};

/** UN-05 habit-grid — 3 habit rows × 7 day dots, each row its own hue. */
export const UN05HabitGrid: StoryObj<typeof meta> = {
  args: {
    variant: 'habit-grid',
    title: 'HABITS × DAYS',
    habits: [
      { label: 'MEDITATE', days: [1, 1, 0, 1, 1, 1, 0] },
      { label: 'LIFT', days: [1, 0, 1, 0, 1, 0, 0] },
      { label: 'SUNLIGHT', days: [1, 1, 1, 1, 0, 1, 1] },
    ],
  },
};

/** The catalog glow modifier — soft mint underlays on every 7th filled dot. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'waffle-90', total: 90, done: 56, title: '90-DAY LOCK-IN', shine: true },
};

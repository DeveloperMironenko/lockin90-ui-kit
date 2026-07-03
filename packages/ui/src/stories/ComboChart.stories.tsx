import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ComboChart } from '../components/ComboChart';

/* Story data reproduces the combo catalog cards
   (lockin90-design/charts/combo-charts.html · CB-01/04/05) so parity vs the
   design page is verifiable by eye — the component defaults ARE the catalog
   pairs; the SELECT metric-pair stories carry the page's other arrays. */

/* CB-01 SELECT pairs (the catalog's SLEEPH/HRV + KCAL/WEIGHT arrays) */
const SLEEPH = [0.65, 0.7, 0.5, 0.75, 0.6, 0.8, 0.7, 0.55, 0.72, 0.66, 0.78, 0.62, 0.74, 0.7];
const HRV = [0.55, 0.6, 0.45, 0.62, 0.5, 0.7, 0.64, 0.42, 0.6, 0.55, 0.68, 0.5, 0.66, 0.72];
const KCAL = [0.6, 0.72, 0.55, 0.66, 0.8, 0.62, 0.58, 0.74, 0.6, 0.68, 0.55, 0.7, 0.64, 0.6];
const WEIGHT = [0.8, 0.79, 0.78, 0.78, 0.77, 0.75, 0.75, 0.73, 0.72, 0.72, 0.7, 0.69, 0.68, 0.66];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/ComboChart',
  component: ComboChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof ComboChart>;
export default meta;

/** CB-01 bars-line — THE dual-metric dashboard chart: violet training bars +
 *  mint energy line + stacked legend pills + '14 DAYS' caption. */
export const CB01BarsLine: StoryObj<typeof meta> = {
  args: { variant: 'bars-line', title: 'TRAINING × ENERGY' },
};

/** CB-01 SELECT — the sleep×HRV metric pair (cyan bars, violet line). */
export const CB01SleepHrv: StoryObj<typeof meta> = {
  args: {
    variant: 'bars-line',
    title: 'SLEEP × HRV',
    bars: { label: 'SLEEP H', data: SLEEPH, color: 'var(--cyan)', max: 1 },
    line: { label: 'HRV', data: HRV, color: 'var(--violet)', max: 1 },
  },
};

/** CB-01 SELECT — the kcal×weight pair: faint lime bars, white weight line
 *  + the dashed amber 'GOAL 78KG' rule. */
export const CB01KcalWeight: StoryObj<typeof meta> = {
  args: {
    variant: 'bars-line',
    title: 'KCAL × WEIGHT',
    bars: { label: 'KCAL', data: KCAL, color: 'var(--lime)', max: 1, opacity: 0.4 },
    line: { label: 'WEIGHT', data: WEIGHT, color: 'var(--text)', max: 1 },
    goal: 0.62,
    goalLabel: 'GOAL 78KG',
  },
};

/** CB-04 area-line — mint energy area + amber strain line — strain spikes
 *  where energy dips. */
export const CB04AreaLine: StoryObj<typeof meta> = {
  args: { variant: 'area-line', title: 'ENERGY × STRAIN' },
};

/** CB-05 bars-plan — mint volume bars + dashed white stepped plan line
 *  (the progressive-overload ramp) + note pill. */
export const CB05BarsPlan: StoryObj<typeof meta> = {
  args: { variant: 'bars-plan', title: 'LIFTED VS PLAN' },
};

/** The catalog glow modifier — mint glow under the energy line. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'bars-line', title: 'TRAINING × ENERGY', caption: '', shine: true },
};

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ChartState } from '../components/ChartState';

/* Story data reproduces the chart-states catalog cards
   (lockin90-design/charts/state-charts.html · SV-01…SV-06). The component
   defaults ARE the cards (skeleton bars · wave-5 locked curve · wave-9
   partial line, same ported PRNG) — parity vs the design page is verifiable
   by eye. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/ChartState',
  component: ChartState,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof ChartState>;
export default meta;

/** SV-01 skeleton-chart — gray placeholder bars + title/legend stubs at the
 *  real chart geometry; no layout shift when data lands (and no shimmer —
 *  reduced-motion safe). */
export const SV01SkeletonChart: StoryObj<typeof meta> = {
  args: {},
};

/** SV-02 loading-ring — small spinner arc + what is actually loading
 *  ('SYNCING WHOOP + OURA'). */
export const SV02LoadingRing: StoryObj<typeof meta> = {
  args: { variant: 'loading-ring' },
};

/** SV-03 empty-cta — dashed ghost bars + one-line reason + filled mint CTA
 *  pill (click it — `onCtaPress`). */
export const SV03EmptyCta: StoryObj<typeof meta> = {
  args: {
    variant: 'empty-cta',
    onCtaPress: () => {
      /* wire to the log flow */
    },
  },
};

/** SV-04 locked-forecast — dashed ghost curve + 'unlocks at 7 days' + 3/7
 *  progress dots — progress toward the feature. */
export const SV04LockedForecast: StoryObj<typeof meta> = {
  args: { variant: 'locked-forecast' },
};

/** SV-05 error-retry — coral warning triangle + plain-words reason + RETRY
 *  pill (click it — `onCtaPress`). */
export const SV05ErrorRetry: StoryObj<typeof meta> = {
  args: {
    variant: 'error-retry',
    onCtaPress: () => {
      /* wire to the refetch */
    },
  },
};

/** SV-06 partial-sync — line solid until the last synced point, dashed
 *  ghost after + shaded pending region + amber SYNC PENDING pill. */
export const SV06PartialSync: StoryObj<typeof meta> = {
  args: { variant: 'partial-sync' },
};

/** The catalog glow modifier — glow underlay behind the accent mark
 *  (here: the CTA pill). */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'empty-cta', shine: true },
};

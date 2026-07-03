import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hypnogram } from '../components/Hypnogram';

const meta = {
  title: 'Primitives/Hypnogram',
  component: Hypnogram,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Hypnogram>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const NoLabels: StoryObj<typeof meta> = {
  args: { showStageLabels: false },
};

export const Short: StoryObj<typeof meta> = {
  args: {
    segments: [
      { stage: 'awake', minutes: 8 },
      { stage: 'light', minutes: 42 },
      { stage: 'deep', minutes: 55 },
      { stage: 'rem', minutes: 22 },
      { stage: 'light', minutes: 30 },
    ],
    axis: ['11p', '12a', '1a'],
  },
};

/** SL-01 with the shine glow underlay. */
export const SL01Shine: StoryObj<typeof meta> = {
  args: { shine: true },
};

/** SL-04 · efficiency-bars — violet asleep bars up / amber awake bars down from
 *  the midline · ASLEEP/AWAKE tags · clock axis. Defaults reproduce the catalog
 *  card's deterministic night (32 buckets, 3 brief awakenings). */
export const SL04EfficiencyBars: StoryObj<typeof meta> = {
  args: {
    variant: 'efficiency-bars',
    asleepLabel: 'ASLEEP 94%',
    awakeLabel: 'AWAKE 22 MIN',
    ariaLabel: 'Sleep efficiency through the night: 94% asleep, 22 minutes awake',
  },
};

/** SL-05 · sleep-week — 7 duration bars (violet ≥ target−30m, amber under) +
 *  dashed mint TARGET 8H rule + day letters. Catalog data. */
export const SL05SleepWeek: StoryObj<typeof meta> = {
  args: {
    variant: 'sleep-week',
    week: [7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7],
    targetHours: 8,
    ariaLabel: 'Hours slept per day this week against an 8 hour target',
  },
};

/** SL-06 · bedtime-drift — BED (violet, coral when late) + WAKE (amber) dots
 *  joined per day · mint CONSISTENT WINDOW band. Weekend drift visible. */
export const SL06BedtimeDrift: StoryObj<typeof meta> = {
  args: {
    variant: 'bedtime-drift',
    nights: [
      { bed: 22.6, wake: 6.9 },
      { bed: 22.9, wake: 6.7 },
      { bed: 22.4, wake: 7.0 },
      { bed: 22.7, wake: 6.8 },
      { bed: 24.5, wake: 7.6 },
      { bed: 25.0, wake: 7.9 },
      { bed: 22.9, wake: 7.0 },
    ],
    consistencyWindow: [22.3, 23.5],
    ariaLabel: 'Bed and wake times per day this week; Friday and Saturday bedtimes ran late',
  },
};

/** SL-07 · night-coach WITH the mint recommendation pill (catalog copy). */
export const SL07NightCoach: StoryObj<typeof meta> = {
  args: {
    variant: 'night-coach',
    wakeWindowAt: 0.62,
    recommendation: 'TRY LIGHTS-OUT 22:40 · +24 MIN DEEP',
    ariaLabel: 'Last night sleep stages with the coach wake window and a recommendation',
  },
};

/** SL-07 · night-coach data-only SELECT — wake-window rule, no recommendation. */
export const SL07DataOnly: StoryObj<typeof meta> = {
  args: {
    variant: 'night-coach',
    wakeWindowAt: 0.62,
    ariaLabel: 'Last night sleep stages with the coach wake window',
  },
};

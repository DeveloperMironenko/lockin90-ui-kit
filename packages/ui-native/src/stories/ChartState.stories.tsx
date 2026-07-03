import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ChartState } from '../components/ChartState';

/* Story data reproduces the chart-states catalog cards
   (lockin90-design/charts/state-charts.html · SV-01…SV-06). The component
   defaults ARE the cards — parity vs the design page and the web twin is
   verifiable by eye. */

const meta = { title: 'Native/ChartState' } satisfies Meta;
export default meta;

/** SV-01 skeleton-chart — gray placeholder bars + title/legend stubs at the
 *  real chart geometry; no layout shift when data lands. */
export const SV01SkeletonChart: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState />
    </View>
  ),
};

/** SV-02 loading-ring — small spinner arc + what is actually loading
 *  ('SYNCING WHOOP + OURA'). */
export const SV02LoadingRing: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState variant="loading-ring" />
    </View>
  ),
};

/** SV-03 empty-cta — dashed ghost bars + one-line reason + filled mint CTA
 *  pill (press it — `onCtaPress`). */
export const SV03EmptyCta: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState
        variant="empty-cta"
        onCtaPress={() => {
          /* wire to the log flow */
        }}
      />
    </View>
  ),
};

/** SV-04 locked-forecast — dashed ghost curve + 'unlocks at 7 days' + 3/7
 *  progress dots — progress toward the feature. */
export const SV04LockedForecast: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState variant="locked-forecast" />
    </View>
  ),
};

/** SV-05 error-retry — coral warning triangle + plain-words reason + RETRY
 *  pill (press it — `onCtaPress`). */
export const SV05ErrorRetry: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState
        variant="error-retry"
        onCtaPress={() => {
          /* wire to the refetch */
        }}
      />
    </View>
  ),
};

/** SV-06 partial-sync — line solid until the last synced point, dashed
 *  ghost after + shaded pending region + amber SYNC PENDING pill (static
 *  dot + halo on native — the web SMIL pulse is a substrate diff). */
export const SV06PartialSync: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState variant="partial-sync" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate behind the CTA pill
 *  (no blur filters on native). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ChartState variant="empty-cta" shine />
    </View>
  ),
};

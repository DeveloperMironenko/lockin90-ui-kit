import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ShareCard } from '../components/ShareCard';

const meta = { title: 'Native/ShareCard' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** Ring readout — the canonical energy-score share. */
export const RingScore: Story = {
  render: () => (
    <View style={{ padding: 16, maxWidth: 340 }}>
      <ShareCard
        title="Last 7 days"
        metric={76}
        metricLabel="High zone"
        ring={{ value: 76, max: 100 }}
        gradient="flux"
        size="md"
        stats={[
          { label: 'Best', value: '88' },
          { label: 'Sleep', value: '7h18' },
          { label: 'Streak', value: '23d' },
        ]}
      />
    </View>
  ),
};

/** Big number headline (no ring) — a streak/PR card. */
export const NumberHeadline: Story = {
  render: () => (
    <View style={{ padding: 16, maxWidth: 340 }}>
      <ShareCard
        title="Current streak"
        metric="23"
        metricLabel="days locked in"
        gradient="cta"
        size="md"
        stats={[
          { label: 'Best', value: '41d' },
          { label: 'This year', value: '212' },
        ]}
      />
    </View>
  ),
};

/** Mint gradient, square (1:1) aspect. */
export const MintSquare: Story = {
  render: () => (
    <View style={{ padding: 16, maxWidth: 260 }}>
      <ShareCard title="Recovery" metric={91} metricLabel="Peak" ring={{ value: 91 }} gradient="mint" size="sm" />
    </View>
  ),
};

/** Violet gradient, story (9:16) aspect, no supporting stats. */
export const VioletStory: Story = {
  render: () => (
    <View style={{ padding: 16, maxWidth: 260 }}>
      <ShareCard
        title="Personal best"
        metric="142.5kg"
        metricLabel="Back squat · +5kg"
        gradient="violet"
        size="lg"
      />
    </View>
  ),
};

/** Unbranded variant (brand mark + watermark hidden). */
export const Unbranded: Story = {
  render: () => (
    <View style={{ padding: 16, maxWidth: 340 }}>
      <ShareCard
        title="Avg energy"
        metric={84}
        metricLabel="out of 100"
        ring={{ value: 84 }}
        gradient="flux"
        size="md"
        brand={false}
      />
    </View>
  ),
};

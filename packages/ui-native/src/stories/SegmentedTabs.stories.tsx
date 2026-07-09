import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SegmentedTabs } from '../components/SegmentedTabs';

const meta = { title: 'Native/SegmentedTabs' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs />
    </View>
  ),
};

export const TwoUp: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs tabs={['Following', 'All Men']} active={0} />
    </View>
  ),
};

/** Time-range control where the longer ranges are gated behind an upsell. */
export const Locked: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs tabs={['1M', '3M', '1Y', 'All']} active={0} locked={[2, 3]} />
    </View>
  ),
};

/** Catalog type switcher — each segment carries a trailing count badge. */
export const WithCounts: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <SegmentedTabs
        tabs={[
          { label: 'Substances', count: 486 },
          { label: 'Products', count: 128 },
          { label: 'Lab Tests', count: 74 },
          { label: 'Interactions', count: 63 },
        ]}
        active={0}
      />
    </View>
  ),
};

/** Rollout flag — semantic per-item tones colour the active segment + leading
 *  dot. Canary paints amber. (Distinct from the control-level `tone` prop.) */
export const Tones: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs
        tabs={[
          { label: 'Off', tone: 'danger' },
          { label: 'Canary', tone: 'canary' },
          { label: 'On', tone: 'ok' },
        ]}
        active={1}
      />
    </View>
  ),
};

/** Control-level `tone="mint"` — the selected segment uses the mint gradient +
 *  glow + dark label (the onboarding Activity-level control). */
export const MintTone: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs tabs={['Sedentary', 'Light', 'Active', 'Athlete']} active={2} tone="mint" />
    </View>
  ),
};

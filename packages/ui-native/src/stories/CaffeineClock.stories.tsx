import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CaffeineClock } from '../components/CaffeineClock';

/* Story data reproduces the caffeine catalog cards
   (lockin90-design/charts/caffeine-charts.html · CF-01…CF-03) so parity vs
   the design page — and the web twin — is verifiable by eye; the component
   defaults ARE the catalog doses. */

const meta = { title: 'Native/CaffeineClock' } satisfies Meta;
export default meta;

/** CF-01 decay-curve — t½ 5.7h decay + 50MG threshold + bed verdict ✓. */
export const CF01DecayCurve: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CaffeineClock title="COFFEE 8:30 · 120MG" />
    </View>
  ),
};

/** CF-02 stacked-doses — faint per-dose curves + bold TOTAL + coral verdict. */
export const CF02StackedDoses: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CaffeineClock variant="stacked-doses" title="3 DOSES TODAY" />
    </View>
  ),
};

/** CF-03 safe-window — gradient day strip + LAST SAFE COFFEE tick + NOW. */
export const CF03SafeWindow: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CaffeineClock variant="safe-window" title="CAN I HAVE ONE MORE?" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate stroke (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CaffeineClock shine title="COFFEE 8:30 · 120MG" />
    </View>
  ),
};

/** Real-data example — a heavy day against a 22:30 bedtime (coral verdict). */
export const LateDoseDay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <CaffeineClock
        variant="stacked-doses"
        doses={[
          { atH: 7, mg: 150 },
          { atH: 12.5, mg: 90 },
          { atH: 16, mg: 120 },
        ]}
        bedH={22.5}
        title="HEAVY DAY · 3 DOSES"
      />
    </View>
  ),
};

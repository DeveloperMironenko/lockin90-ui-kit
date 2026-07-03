import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { FunnelChart, type FunnelStage } from '../components/FunnelChart';

/* Story data reproduces the funnel catalog cards
   (lockin90-design/charts/funnel-charts.html · FN-01/03/04/05) so parity vs
   the design page — and the web twin — is verifiable by eye. */

const STAGES: FunnelStage[] = [
  { label: 'SIGNED UP', value: 1 },
  { label: 'CONNECTED DEVICE', value: 0.72 },
  { label: 'FIRST SYNC', value: 0.58 },
  { label: 'DAY-7 ACTIVE', value: 0.34 },
];

/* FN-05 ghosts = the catalog's derived previous period (min(1, v·0.85 + 0.06)) */
const COMPARE_STAGES: FunnelStage[] = [
  { label: 'SIGNED UP', value: 1, prev: 0.91 },
  { label: 'CONNECTED DEVICE', value: 0.72, prev: 0.672 },
  { label: 'FIRST SYNC', value: 0.58, prev: 0.553 },
  { label: 'DAY-7 ACTIVE', value: 0.34, prev: 0.349 },
];

const meta = { title: 'Native/FunnelChart' } satisfies Meta;
export default meta;

/** FN-01 band-funnel — centered trapezoid bands, solid spectrum-token fill. */
export const FN01BandFunnel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart stages={STAGES} title="ONBOARDING · THIS MONTH" />
    </View>
  ),
};

/** FN-01 fill SELECT — faint glass bands, labels take the stage color. */
export const FN01Glass: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart stages={STAGES} fill="glass" title="ONBOARDING · THIS MONTH" />
    </View>
  ),
};

/** FN-03 bar-funnel — left-aligned bars + % + coral per-stage drop labels. */
export const FN03BarFunnel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart stages={STAGES} variant="bar-funnel" title="FUNNEL · STAGE DROP" />
    </View>
  ),
};

/** FN-04 zone-funnel — bar color = conversion zone (good / warn / bad). */
export const FN04ZoneFunnel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart stages={STAGES} variant="zone-funnel" title="FUNNEL HEALTH" />
    </View>
  ),
};

/** FN-05 compare-funnel — thin bars over white-14% previous-period ghosts. */
export const FN05CompareFunnel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart
        stages={COMPARE_STAGES}
        variant="compare-funnel"
        title="FUNNEL VS LAST MONTH"
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate shape (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <FunnelChart stages={STAGES} shine title="ONBOARDING · THIS MONTH" />
    </View>
  ),
};

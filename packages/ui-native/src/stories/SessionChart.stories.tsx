import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { SessionChart } from '../components/SessionChart';

/* Story data reproduces the session catalog cards
   (lockin90-design/charts/session-charts.html · SN-01…SN-10) so parity vs
   the design page — and the web twin — is verifiable by eye. The component's
   deterministic default traces (mulberry32 seeds 11/22/44/55/77), zones,
   rounds, minutes, titles and header stats ARE the catalog data. */

const meta = { title: 'Native/SessionChart' } satisfies Meta;
export default meta;

/* ---------- A · heart-rate training ---------- */

/** SN-01 hr-zones-session — 5 zone bands + trace stroked by zone height. */
export const SN01HrZonesSession: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart />
    </View>
  ),
};

/** SN-02 hr-intervals — zone bands + 5 coral work blocks, Z2↔Z5 swings. */
export const SN02HrIntervals: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="hr-intervals" intervals={5} />
    </View>
  ),
};

/** SN-03 time-in-zones — 5 zone rows, rounded bars by minutes + MIN labels. */
export const SN03TimeInZones: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="time-in-zones" minutes={[4, 12, 18, 14, 4]} />
    </View>
  ),
};

/** SN-04 hr-recovery — peak pulse + dashed 60s bracket + mint recovery tag. */
export const SN04HrRecovery: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="hr-recovery" />
    </View>
  ),
};

/* ---------- B · heat & recovery sessions ---------- */

/** SN-05 sauna-rounds — amber round blocks + PLUNGE tags, TEMP + HR traces. */
export const SN05SaunaRounds: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="sauna-rounds" />
    </View>
  ),
};

/** SN-06 sauna-heat-ramp — cyan→amber→coral ramp vs dashed TARGET + pulse. */
export const SN06SaunaHeatRamp: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="sauna-heat-ramp" />
    </View>
  ),
};

/** SN-07 night-recovery — violet canvas, HRV mint up + RHR violet dashed down. */
export const SN07NightRecovery: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="night-recovery" />
    </View>
  ),
};

/** SN-09 glucose-response — meal-anchored curve, baseline band, peak + return. */
export const SN09GlucoseResponse: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="glucose-response" />
    </View>
  ),
};

/** SN-10 response-overlay — 3 faint single-meal curves + bold cyan mean. */
export const SN10ResponseOverlay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart variant="response-overlay" />
    </View>
  ),
};

/** Real data — a session trace passed in (0–1 of the intensity scale). */
export const RealSession: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart
        hrSamples={[
          0.2, 0.25, 0.34, 0.45, 0.55, 0.6, 0.63, 0.66, 0.7, 0.72, 0.68, 0.65, 0.7, 0.74, 0.78,
          0.75, 0.7, 0.66, 0.62, 0.55, 0.45, 0.36, 0.3, 0.26,
        ]}
        title="MORNING RUN"
        stat="141 AVG BPM"
        statColor={colors.mint}
        axisLabels={[
          { at: 0, label: '0' },
          { at: 1, label: '38 MIN' },
        ]}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate stroke (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <SessionChart shine />
    </View>
  ),
};

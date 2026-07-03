import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { VitalsStrip } from '../components/VitalsStrip';

/* Story data reproduces the vitals catalog cards
   (lockin90-design/charts/vitals-charts.html · VT-01…VT-05) so parity vs
   the design page — and the web twin — is verifiable by eye; the component
   defaults ARE the catalog RR runs (page px × 23.5 = ms). */

const meta = { title: 'Native/VitalsStrip' } satisfies Meta;
export default meta;

/** VT-01 ecg-strip — sharp PQRST beats + big BPM + pulse on the last R peak. */
export const VT01EcgStrip: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip title="RESTING HR · LIVE" />
    </View>
  ),
};

/** VT-02 hrv-rhythm — uneven RR spacing + ms bracket ruler + HRV pill. */
export const VT02HrvRhythm: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip variant="hrv-rhythm" title="HRV · RR INTERVALS" />
    </View>
  ),
};

/** VT-03 monitor — ECG mint + slow respiration cyan + HR/HRV/RESP stats. */
export const VT03Monitor: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip variant="monitor" title="MONITOR" />
    </View>
  ),
};

/** VT-04 night-hr — overnight HR curve + LOW dip pill + WAKE spike + ticks. */
export const VT04NightHr: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip variant="night-hr" title="OVERNIGHT HR" lowLabel="LOW 44 · 3:12AM" />
    </View>
  ),
};

/** VT-05 anomaly-beat — one premature beat coral + dashed ring + pill. */
export const VT05AnomalyBeat: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip variant="anomaly-beat" title="RHYTHM CHECK" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate stroke (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <VitalsStrip shine title="RESTING HR · LIVE" />
    </View>
  ),
};

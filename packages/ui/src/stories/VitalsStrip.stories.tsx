import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { VitalsStrip } from '../components/VitalsStrip';

/* Story data reproduces the vitals catalog cards
   (lockin90-design/charts/vitals-charts.html · VT-01…VT-05) so parity vs
   the design page is verifiable by eye — the component defaults ARE the
   catalog RR runs (page px × 23.5 = ms). */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/VitalsStrip',
  component: VitalsStrip,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof VitalsStrip>;
export default meta;

/** VT-01 ecg-strip — sharp PQRST beats on ECG paper · big mono BPM · pulse
 *  on the latest R peak. */
export const VT01EcgStrip: StoryObj<typeof meta> = {
  args: { title: 'RESTING HR · LIVE' },
};

/** VT-02 hrv-rhythm — visibly uneven beat spacing + RR bracket ruler (ms per
 *  gap) + HRV pill — variability is the story. */
export const VT02HrvRhythm: StoryObj<typeof meta> = {
  args: { variant: 'hrv-rhythm', title: 'HRV · RR INTERVALS' },
};

/** VT-03 monitor — ECG mint + slow respiration cyan + HR/HRV/RESP stats. */
export const VT03Monitor: StoryObj<typeof meta> = {
  args: { variant: 'monitor', title: 'MONITOR' },
};

/** VT-04 night-hr — compressed overnight HR curve in a shaded sleep window ·
 *  LOW pill at the dip · WAKE spike amber · 11PM/3AM/7AM ticks. */
export const VT04NightHr: StoryObj<typeof meta> = {
  args: { variant: 'night-hr', title: 'OVERNIGHT HR', lowLabel: 'LOW 44 · 3:12AM' },
};

/** VT-05 anomaly-beat — ONE premature beat re-drawn coral + dashed ring +
 *  IRREGULAR pill (auto-detected at the shortest RR). */
export const VT05AnomalyBeat: StoryObj<typeof meta> = {
  args: { variant: 'anomaly-beat', title: 'RHYTHM CHECK' },
};

/** The catalog glow modifier — blurred mint underlay along the trace. */
export const Shine: StoryObj<typeof meta> = {
  args: { shine: true, title: 'RESTING HR · LIVE' },
};

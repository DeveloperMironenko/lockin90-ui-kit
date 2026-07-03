import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { WatchComplication } from '../components/WatchComplication';

/* Story data reproduces the watch catalog cards
   (lockin90-design/charts/watch-charts.html · WC-01/02/04/05/06/07). The
   cards are fixed synthetic values, and the component's per-variant defaults
   ARE those values — the catalog draws each complication 2× (size 108), so
   parity vs the design page — and the web twin — is verifiable by eye. */

/** The catalog's WC-04 demo trend (SP — 10 nights of sleep). */
const SPARK = [0.4, 0.55, 0.45, 0.6, 0.5, 0.7, 0.62, 0.78, 0.66, 0.8];

const meta = { title: 'Native/WatchComplication' } satisfies Meta;
export default meta;

/** WC-01 ring-score — graphic-circular: 82% mint ring on a faint track + big
 *  value + label. THE watch-face energy score. */
export const WC01RingScore: StoryObj = {
  render: () => <WatchComplication value={82} label="ENERGY" />,
};

/** WC-02 battery-gauge — 270° gauge, zone-colored + bolt glyph + % — body
 *  battery at a glance. */
export const WC02BatteryGauge: StoryObj = {
  render: () => <WatchComplication variant="battery-gauge" value={64} label="BATTERY" />,
};

/** WC-04 micro-spark — big value + 10-point micro sparkline + end dot inside
 *  the circle. */
export const WC04MicroSpark: StoryObj = {
  render: () => <WatchComplication variant="micro-spark" data={SPARK} valueText="7:42" label="SLEEP" />,
};

/** WC-05 corner-gauge — square face, 4 corner micro-widgets; featured TL
 *  half-arc gauge + tiny value (UV 6) in a dashed slot ring. */
export const WC05CornerGauge: StoryObj = {
  render: () => (
    <WatchComplication
      variant="corner-gauge"
      corners={{ value: 60, label: 'UV6', text: '23°', dots: 2, ring: 69 }}
    />
  ),
};

/** WC-06 inline-pill — wide pill: mini ring + mono text + progress bar —
 *  one-line data (rectangular slot + lock screen). Catalog scale = size 150. */
export const WC06InlinePill: StoryObj = {
  render: () => <WatchComplication variant="inline-pill" value={92} label="CREATINE" size={150} />,
};

/** WC-07 rings-trio — three concentric rings (move mint / train cyan / sleep
 *  violet) with round caps — the activity-rings slot. */
export const WC07RingsTrio: StoryObj = {
  render: () => <WatchComplication variant="rings-trio" value={80} value2={60} value3={45} />,
};

/** The catalog glow modifier — wider faint duplicate arcs (no filters). */
export const Shine: StoryObj = {
  render: () => <WatchComplication value={82} label="ENERGY" shine />,
};

/** 1× complication scale — the same faces at the real slot size (54px). */
export const OneXScale: StoryObj = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <WatchComplication size={54} />
      <WatchComplication variant="battery-gauge" size={54} />
      <WatchComplication variant="rings-trio" size={54} />
      <WatchComplication variant="inline-pill" size={75} />
    </View>
  ),
};

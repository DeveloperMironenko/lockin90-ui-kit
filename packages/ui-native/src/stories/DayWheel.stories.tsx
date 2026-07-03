import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { DayWheel, type DayWheelEvent } from '../components/DayWheel';

/* Story data reproduces the radial catalog cards
   (lockin90-design/charts/radial-charts.html · RA-01/03/05/06) via the page's
   own dayVals(seed) circadian generator + seeds, so parity vs the design page
   — and the web twin — is verifiable by eye. */

/** Deterministic PRNG (catalog mulberry32). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** The page's dayVals(seed) — a circadian base curve (morning ramp, midday
 *  peak, siesta dip, evening bump) + seeded noise, 24 hourly 0–1 values. */
function dayVals(seed: number): number[] {
  const r = mulberry32(seed);
  const out: number[] = [];
  for (let h = 0; h < 24; h++) {
    const t = h / 24;
    const v =
      0.15 +
      0.6 * Math.exp(-Math.pow((t - 0.46) / 0.17, 2)) +
      0.28 * Math.exp(-Math.pow((t - 0.79) / 0.09, 2)) -
      0.14 * Math.exp(-Math.pow((t - 0.63) / 0.05, 2));
    out.push(clamp(v + (r() - 0.5) * 0.06));
  }
  return out;
}

/** The page's fixed RA-01 demo events (EVENTS). */
const EVENTS: DayWheelEvent[] = [
  { at: 7.2, color: colors.mint },
  { at: 9.5, color: colors.zoneMid },
  { at: 12.8, color: colors.lime },
  { at: 17.5, color: colors.cyan },
  { at: 22.4, color: colors.violet },
];

const meta = { title: 'Native/DayWheel' } satisfies Meta;
export default meta;

/** RA-01 clock-events — 24h tick ring (bold 6h) + glowing event dots on the
 *  rim + NOW hand + digital center (static dot + halo on native — the web
 *  SMIL pulse ring is a substrate diff). */
export const RA01ClockEvents: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayWheel events={EVENTS} now={14.6} />
    </View>
  ),
};

/** RA-03 radial-bars — 24 radiating 4.5px round bars, length = value,
 *  color = zone. */
export const RA03RadialBars: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayWheel variant="radial-bars" hours={dayVals(22)} />
    </View>
  ),
};

/** RA-05 zone-wheel — 24 arc segments · zone color + opacity by value ·
 *  center score. */
export const RA05ZoneWheel: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayWheel variant="zone-wheel" hours={dayVals(33)} score="74" />
    </View>
  ),
};

/** RA-06 radial-heat — 7 concentric day-rings × 24 mint segments,
 *  opacity = value. */
export const RA06RadialHeat: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayWheel
        variant="radial-heat"
        week={Array.from({ length: 7 }, (_, d) => dayVals(30 + d * 7))}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate bars (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <DayWheel variant="radial-bars" hours={dayVals(22)} shine />
    </View>
  ),
};

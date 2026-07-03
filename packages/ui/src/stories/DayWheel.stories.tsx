import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { DayWheel, type DayWheelEvent } from '../components/DayWheel';

/* Story data reproduces the radial catalog cards
   (lockin90-design/charts/radial-charts.html · RA-01/03/05/06) via the page's
   own dayVals(seed) circadian generator + seeds, so parity vs the design page
   is verifiable by eye. */

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
  { at: 7.2, color: 'var(--mint)' },
  { at: 9.5, color: 'var(--zone-mid)' },
  { at: 12.8, color: 'var(--lime)' },
  { at: 17.5, color: 'var(--cyan)' },
  { at: 22.4, color: 'var(--violet)' },
];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/DayWheel',
  component: DayWheel,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof DayWheel>;
export default meta;

/** RA-01 clock-events — 24h tick ring (bold 6h) + glowing event dots on the
 *  rim + NOW hand + pulse + digital center. */
export const RA01ClockEvents: StoryObj<typeof meta> = {
  args: { events: EVENTS, now: 14.6 },
};

/** RA-03 radial-bars — 24 radiating 4.5px round bars, length = value,
 *  color = zone. */
export const RA03RadialBars: StoryObj<typeof meta> = {
  args: { variant: 'radial-bars', hours: dayVals(22) },
};

/** RA-05 zone-wheel — 24 arc segments · zone color + opacity by value ·
 *  center score. */
export const RA05ZoneWheel: StoryObj<typeof meta> = {
  args: { variant: 'zone-wheel', hours: dayVals(33), score: '74' },
};

/** RA-06 radial-heat — 7 concentric day-rings × 24 mint segments,
 *  opacity = value. */
export const RA06RadialHeat: StoryObj<typeof meta> = {
  args: {
    variant: 'radial-heat',
    week: Array.from({ length: 7 }, (_, d) => dayVals(30 + d * 7)),
  },
};

/** The catalog glow modifier — soft blur underlay behind the zone bars. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'radial-bars', hours: dayVals(22), shine: true },
};

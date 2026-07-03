import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { BodyBattery } from '../components/BodyBattery';

/* Story data reproduces the body-battery catalog cards
   (lockin90-design/charts/body-battery-charts.html · BB-01/02/05/06/07) so
   parity vs the design page is verifiable by eye — same mulberry32 seeds
   as the page's bbDay generator. */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** the page's bbDay: charges 11pm–7am, drains 7am–11pm with random dips */
function bbDay(seed: number): number[] {
  const r = mulberry32(seed);
  const out: number[] = [];
  let lvl = 0.28;
  for (let i = 0; i < 48; i++) {
    const hr = i / 2; // 0..24 from midnight
    const asleep = hr < 7 || hr > 23;
    lvl = asleep ? Math.min(0.97, lvl + 0.045) : Math.max(0.05, lvl - 0.018 - (r() < 0.08 ? 0.05 : 0));
    out.push(lvl);
  }
  return out;
}

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/BodyBattery',
  component: BodyBattery,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof BodyBattery>;
export default meta;

/** BB-01 battery-day — zone-stroked % curve over 24h · violet sleep shading
 *  + CHARGING bolt · NOW pulse + % pill · day axis (page seed 11). */
export const BB01BatteryDay: StoryObj<typeof meta> = {
  args: { levels: bbDay(11), now: 0.62, title: 'BODY BATTERY · TODAY' },
};

/** BB-02 battery-glyph — the glanceable status widget (level + empty-ETA). */
export const BB02BatteryGlyph: StoryObj<typeof meta> = {
  args: { variant: 'battery-glyph', level: 0.64, title: 'RIGHT NOW' },
};

/** BB-02 SELECT — charging state: dark bolt in the fill + full-ETA. */
export const BB02Charging: StoryObj<typeof meta> = {
  args: { variant: 'battery-glyph', level: 0.42, state: 'charging', title: 'RIGHT NOW' },
};

/** BB-02 SELECT — low state: coral fill + advice pill. */
export const BB02Low: StoryObj<typeof meta> = {
  args: { variant: 'battery-glyph', level: 0.17, state: 'low', title: 'RIGHT NOW' },
};

/** BB-05 drain-events — day curve + coral attribution pills (page seed 22). */
export const BB05DrainEvents: StoryObj<typeof meta> = {
  args: { variant: 'drain-events', levels: bbDay(22), title: 'WHAT DRAINED YOU' },
};

/** BB-06 battery-week — 7 mini vertical batteries + % + day letters. */
export const BB06BatteryWeek: StoryObj<typeof meta> = {
  args: { variant: 'battery-week', title: 'END-OF-DAY CHARGE · WEEK' },
};

/** BB-07 battery-vs — today zone curve + dashed yesterday (page seed 33/38). */
export const BB07BatteryVs: StoryObj<typeof meta> = {
  args: {
    variant: 'battery-vs',
    levels: bbDay(33),
    compareLevels: bbDay(38).map((v) => v * 0.88),
    title: 'TODAY VS YESTERDAY',
  },
};

/** The catalog glow modifier — blurred zone-gradient underlay on the curve. */
export const Shine: StoryObj<typeof meta> = {
  args: { levels: bbDay(11), now: 0.62, shine: true, title: 'BODY BATTERY · TODAY' },
};

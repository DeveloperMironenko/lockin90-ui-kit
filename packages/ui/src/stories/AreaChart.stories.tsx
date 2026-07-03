import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart, type AreaMultiple, type AreaSeries } from '../components/AreaChart';

/* Story data reproduces the stacked-area catalog cards
   (lockin90-design/charts/area-charts.html · AR-01/03/04/05/06/07) so parity
   vs the design page is verifiable by eye — same mulberry32 seeds as the page. */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** catalog.js `genData('wave', …)` — faithful port (the area page's generator) */
function genWave(seed: number, n: number): number[] {
  const rnd = mulberry32(seed);
  const ph = rnd() * 6;
  const f = 1.15 + rnd() * 0.5;
  const amp = 0.2 + rnd() * 0.08;
  const base = 0.48 + rnd() * 0.12;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp(base + Math.sin(t * Math.PI * 2 * f + ph) * amp + (rnd() - 0.5) * 0.08));
  }
  return v;
}

/** the area page's `layers()` — k wave layers rescaled to 0.1 + v·0.35 */
function layers(seed: number, k: number, n = 30): number[][] {
  return Array.from({ length: k }, (_, li) => genWave(seed + li * 11, n).map((v) => 0.1 + v * 0.35));
}

/* catalog trio names (+ a 4th for the SELECT's lime layer) */
const NAMES = ['SLEEP CREDIT', 'FOOD', 'CAFFEINE', 'EXERCISE'];
const toSeries = (L: number[][]): AreaSeries[] => L.map((data, i) => ({ name: NAMES[i], data }));

/* AR-07 — three duo-stack panels, the page's layers(seed + mi·31, 2, 16) */
const MULTIPLES: AreaMultiple[] = ['MON', 'TUE', 'WED'].map((caption, mi) => ({
  caption,
  series: toSeries(layers(77 + mi * 31, 2, 16)),
}));

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof AreaChart>;
export default meta;

/** AR-01 stack — 2-layer stacked areas + edge strokes + top-right legend. */
export const AR01Stack: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(11, 2)), title: 'ENERGY SOURCES · TODAY' },
};

/** AR-01 SELECT — the same stack with 3 series (mint → cyan → violet). */
export const AR01ThreeSeries: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(11, 3)), title: 'ENERGY SOURCES · TODAY' },
};

/** AR-01 SELECT — 4 series (the 4th layer takes the lime token). */
export const AR01FourSeries: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(11, 4)), title: 'ENERGY SOURCES · TODAY' },
};

/** AR-03 percent-stack — every column normalized to a full column (shares). */
export const AR03PercentStack: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(33, 3)), variant: 'percent-stack', title: 'SOURCE SHARE · 100%' },
};

/** AR-04 stream-center — streamgraph, stack centered on the midline. */
export const AR04StreamCenter: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(44, 3)), variant: 'stream-center', title: 'ENERGY STREAM' },
};

/** AR-05 effect-stack — chip labels inside the bands + NOW rule (0.62 of 30 → index 18). */
export const AR05EffectStack: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(55, 3)), variant: 'effect-stack', now: 18, title: 'WHAT POWERS TODAY' },
};

/** AR-06 fade-stack — each band fades 55%→12% vertically, lighter look. */
export const AR06FadeStack: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(66, 3)), variant: 'fade-stack', title: 'ENERGY SOURCES' },
};

/** AR-07 mini-multiples — three duo-stacks side by side + day captions. */
export const AR07MiniMultiples: StoryObj<typeof meta> = {
  args: { variant: 'mini-multiples', multiples: MULTIPLES, title: 'SOURCES · 3 DAYS' },
};

/** The catalog glow modifier — mint glow along the stack's top edge. */
export const Shine: StoryObj<typeof meta> = {
  args: { series: toSeries(layers(11, 3)), shine: true, title: 'ENERGY SOURCES · TODAY' },
};

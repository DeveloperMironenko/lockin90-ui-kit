import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ScatterChart, type ScatterPoint } from '../components/ScatterChart';

/* Story data reproduces the scatter catalog cards
   (lockin90-design/charts/scatter-charts.html · SC-01…SC-07) via the page's
   own correlated-cloud generator + seeds, so parity vs the design page is
   verifiable by eye. */

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

/** The page's points(seed, n, corr) — y = corr·x + noise, z = r(). */
function points(seed: number, n = 26, corr = 0.75): ScatterPoint[] {
  const r = mulberry32(seed);
  const out: ScatterPoint[] = [];
  for (let i = 0; i < n; i++) {
    const x = 0.08 + r() * 0.84;
    const y = clamp(
      0.15 + corr * x * 0.8 + (r() - 0.5) * (1 - corr) * 0.7 + (r() - 0.5) * 0.12,
    );
    out.push({ x, y, z: r() });
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
  title: 'Charts/ScatterChart',
  component: ScatterChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof ScatterChart>;
export default meta;

/** SC-01 mint-scatter — 3px --mint dots at 85% · the basic correlation view. */
export const SC01MintScatter: StoryObj<typeof meta> = {
  args: { points: points(11), title: 'SLEEP → ENERGY · 26 NIGHTS' },
};

/** SC-02 trend-fit — dashed --cyan least-squares line + computed R² pill. */
export const SC02TrendFit: StoryObj<typeof meta> = {
  args: { points: points(22), variant: 'trend-fit', title: 'SLEEP → ENERGY · FITTED' },
};

/** SC-03 bubble-dose — bubble r 2–8 = third variable (dose) + size key + dark rims. */
export const SC03BubbleDose: StoryObj<typeof meta> = {
  args: {
    points: points(33, 26, -0.5),
    variant: 'bubble-dose',
    xLabel: 'CAFFEINE AFTER 14:00 →',
    yLabel: '↑ SLEEP SCORE',
    title: 'CAFFEINE VS SLEEP',
  },
};

/** SC-04 quadrant-map — dashed midlines + 4 captions (SWEET SPOT mint / DANGER coral). */
export const SC04QuadrantMap: StoryObj<typeof meta> = {
  args: {
    points: points(44, 26, 0.55),
    variant: 'quadrant-map',
    xLabel: 'TRAINING LOAD →',
    yLabel: '↑ RECOVERY',
    title: 'LOAD VS RECOVERY',
  },
};

/** SC-05 zone-dots — dot color = y-value zone (mint/amber/coral). */
export const SC05ZoneDots: StoryObj<typeof meta> = {
  args: { points: points(55), variant: 'zone-dots', title: 'NIGHTS BY OUTCOME' },
};

/** SC-06 today-marker — history dots at 28% · TODAY lime pulse + pill. */
export const SC06TodayMarker: StoryObj<typeof meta> = {
  args: { points: points(66), variant: 'today-marker', highlight: 12, title: 'WHERE TODAY LANDS' },
};

/** SC-07 density-cloud — 90 small dots at 40% + dashed --cyan centroid ring. */
export const SC07DensityCloud: StoryObj<typeof meta> = {
  args: { points: points(77, 90), variant: 'density-cloud', title: 'ALL 90 DAYS' },
};

/** The catalog glow modifier — soft per-dot drop-shadow in the dot color. */
export const Shine: StoryObj<typeof meta> = {
  args: { points: points(11), shine: true, title: 'SLEEP → ENERGY · 26 NIGHTS' },
};

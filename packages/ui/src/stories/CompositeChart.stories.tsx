import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { CompositeChart } from '../components/CompositeChart';

/* Story data reproduces the composite catalog cards
   (lockin90-design/charts/composite-charts.html · CM-01/03/05/07). The
   component defaults ARE the cards (treemap TREE · horizon wave-11/22/33/44
   · calendar seed r·7+c+5 · goal tree 74 → 80/55/90); the deviation story
   regenerates the page's noisy rows with the same ported PRNG. */

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

/** The page's genData('noisy') — the horizon card's vs-baseline series. */
function noisy(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const b = 0.5 + (r() - 0.5) * 0.1;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push(clamp(b + Math.sin(t * Math.PI * 2.2 + r()) * 0.12 + (r() - 0.5) * 0.3));
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
  title: 'Charts/CompositeChart',
  component: CompositeChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof CompositeChart>;
export default meta;

/** CM-01 treemap — nested rounded rects, 28% fills + tinted borders
 *  (where the week went, 6 tiles). */
export const CM01Treemap: StoryObj<typeof meta> = {
  args: {},
};

/** CM-01 · SELECT coloring `zone` — tile color = share verdict
 *  (> 20% mint · > 10% amber · else coral). */
export const CM01ZoneColoring: StoryObj<typeof meta> = {
  args: { coloring: 'zone' },
};

/** CM-03 horizon-rows — folded 2-layer bands, 4 metrics × 40 days
 *  (darker = higher). */
export const CM03HorizonRows: StoryObj<typeof meta> = {
  args: { variant: 'horizon-rows' },
};

/** CM-03 · SELECT mode `deviation` — folded |deviation| vs baseline
 *  (the page's noisy series, same seeds). */
export const CM03DeviationMode: StoryObj<typeof meta> = {
  args: {
    variant: 'horizon-rows',
    mode: 'deviation',
    rows: [
      { label: 'ENERGY', color: 'var(--mint)', values: noisy(11, 40) },
      { label: 'HRV', color: 'var(--cyan)', values: noisy(22, 40) },
      { label: 'SLEEP', color: 'var(--violet)', values: noisy(33, 40) },
      { label: 'STRAIN', color: 'var(--zone-mid)', values: noisy(44, 40) },
    ],
  },
};

/** CM-05 calendar-micro — a month grid where every day is a micro
 *  sparkline, zone-colored by its last value. */
export const CM05CalendarMicro: StoryObj<typeof meta> = {
  args: { variant: 'calendar-micro' },
};

/** CM-05 · SELECT cell `bars` — 6 zone-colored micro bars per day. */
export const CM05CalendarBars: StoryObj<typeof meta> = {
  args: { variant: 'calendar-micro', cell: 'bars' },
};

/** CM-07 goal-tree — root goal ring (74) + 3 child habit rings with % +
 *  bezier connectors + pills. */
export const CM07GoalTree: StoryObj<typeof meta> = {
  args: { variant: 'goal-tree' },
};

/** The catalog glow modifier — blurred halo behind the hero tiles (> 20%). */
export const Shine: StoryObj<typeof meta> = {
  args: { shine: true },
};

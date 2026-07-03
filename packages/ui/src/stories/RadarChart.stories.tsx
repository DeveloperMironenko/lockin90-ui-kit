import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { RadarChart } from '../components/RadarChart';

/* Story data reproduces the radar catalog cards
   (lockin90-design/charts/radar-charts.html · RD-01…RD-07) via the page's
   own vals() generator + seeds, so parity vs the design page is verifiable
   by eye. */

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

/** The page's vals(seed) — five axis values in the 0.35–0.95 band. */
function vals(seed: number): number[] {
  const r = mulberry32(seed);
  return Array.from({ length: 5 }, () => 0.35 + r() * 0.6);
}

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof RadarChart>;
export default meta;

/** RD-01 balance-radar — 5 axes, pentagon grid, fill+edge+vertex dots · the balance-wheel hero. */
export const RD01BalanceRadar: StoryObj<typeof meta> = {
  args: { values: vals(11), score: '72 BALANCED', title: 'BODY BALANCE · THIS WEEK' },
};

/** RD-01 fill SELECT `gradient` — mint→violet edge over an --accent 13% fill. */
export const RD01GradientFill: StoryObj<typeof meta> = {
  args: {
    values: vals(11),
    fillStyle: 'gradient',
    score: '72 BALANCED',
    title: 'BODY BALANCE · THIS WEEK',
  },
};

/** RD-02 target-overlay — mint shape over the dashed violet 80% target pentagon + YOU/TARGET pills. */
export const RD02TargetOverlay: StoryObj<typeof meta> = {
  args: { variant: 'target-overlay', values: vals(22), title: 'YOU VS TARGET' },
};

/** RD-03 cohort-ghost — mint shape + text-35% dashed cohort ghost (the card's seed+7 · ×0.85). */
export const RD03CohortGhost: StoryObj<typeof meta> = {
  args: {
    variant: 'cohort-ghost',
    values: vals(33),
    compare: vals(40).map((v) => v * 0.85),
    title: 'YOU VS COHORT',
  },
};

/** RD-04 zone-vertices — neutral text-40% shape · vertex dots colored by value zone. */
export const RD04ZoneVertices: StoryObj<typeof meta> = {
  args: { variant: 'zone-vertices', values: vals(44), title: 'FACTOR HEALTH' },
};

/** RD-06 weeks-trail — 3 overlays W1→W3, opacity 30→100% — the shape expanding. */
export const RD06WeeksTrail: StoryObj<typeof meta> = {
  args: {
    variant: 'weeks-trail',
    trail: [vals(66).map((v) => v * 0.7), vals(69).map((v) => v * 0.85), vals(72)],
    title: 'BALANCE GROWING · 3 WEEKS',
  },
};

/** RD-07 mini-triples — 3 small radars (R30, no labels) + day captions. */
export const RD07MiniTriples: StoryObj<typeof meta> = {
  args: {
    variant: 'mini-triples',
    series: [
      { values: vals(11), label: 'MON' },
      { values: vals(22), label: 'TUE' },
      { values: vals(33), label: 'WED' },
    ],
    title: 'BALANCE · 3 DAYS',
  },
};

/** The catalog glow modifier — a blurred wider duplicate edge behind the shape. */
export const Shine: StoryObj<typeof meta> = {
  args: { values: vals(11), score: '72 BALANCED', shine: true, title: 'BODY BALANCE · THIS WEEK' },
};

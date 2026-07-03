import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import {
  SankeyChart,
  type SankeyChord,
  type SankeyFactor,
  type SankeyLink,
  type SankeyNode,
} from '../components/SankeyChart';

/* Story data reproduces the sankey catalog cards
   (lockin90-design/charts/sankey-charts.html · SK-01…SK-13) — the exact
   node/link/factor/chord values from the page's CFG array, so parity vs the
   design page is verifiable by eye. */

/** shorthand for a catalog flow tuple `[src, dst, fracOfSrc, fracOfDst]` */
const l = (from: number, to: number, fromSize: number, toSize: number): SankeyLink => ({
  from,
  to,
  fromSize,
  toSize,
});

/* SK-01 card — also the base for the ribbonStyle SELECT + Shine stories */
const duoSources: SankeyNode[] = [{ value: 0.6 }, { value: 0.4 }];
const duoTargets: SankeyNode[] = [{ value: 0.55 }, { value: 0.45 }];
const duoLinks: SankeyLink[] = [l(0, 0, 0.7, 0.75), l(0, 1, 0.3, 0.35), l(1, 0, 0.35, 0.25), l(1, 1, 0.65, 0.65)];

/* SK-13 card — factor circle + strength-weighted chords */
const factors: SankeyFactor[] = [
  { label: 'SLEEP', color: 'var(--mint)' },
  { label: 'HRV', color: 'var(--cyan)' },
  { label: 'TRAIN', color: 'var(--violet)' },
  { label: 'FOOD', color: 'var(--lime)' },
  { label: 'MOOD', color: 'var(--zone-mid)' },
];
const chords: SankeyChord[] = [
  { from: 0, to: 1, strength: 8 },
  { from: 0, to: 4, strength: 6 },
  { from: 1, to: 4, strength: 5 },
  { from: 2, to: 1, strength: 4 },
  { from: 3, to: 0, strength: 5 },
  { from: 2, to: 3, strength: 3 },
  { from: 3, to: 4, strength: 4 },
];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/SankeyChart',
  component: SankeyChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof SankeyChart>;
export default meta;

/** SK-01 duo-flow — 2 sources → 2 targets · ribbons 40% src-colored · 8px rounded nodes. */
export const SK01DuoFlow: StoryObj<typeof meta> = {
  args: { sources: duoSources, targets: duoTargets, links: duoLinks },
};

/** SK-02 source-split — one accent source fans into 3 targets. */
export const SK02SourceSplit: StoryObj<typeof meta> = {
  args: {
    variant: 'source-split',
    sources: [{ value: 1, color: 'var(--accent)' }],
    targets: [{ value: 0.45 }, { value: 0.33 }, { value: 0.22 }],
    links: [l(0, 0, 0.45, 1), l(0, 1, 0.33, 1), l(0, 2, 0.22, 1)],
  },
};

/** SK-03 merge-flow — 3 inputs merge into one mint outcome. */
export const SK03MergeFlow: StoryObj<typeof meta> = {
  args: {
    variant: 'merge-flow',
    sources: [{ value: 0.45 }, { value: 0.33 }, { value: 0.22 }],
    targets: [{ value: 1, color: 'var(--mint)' }],
    links: [l(0, 0, 1, 0.45), l(1, 0, 1, 0.33), l(2, 0, 1, 0.22)],
  },
};

/** SK-05 zone-outcomes — inputs flow into good/ok/bad zone-colored outcomes. */
export const SK05ZoneOutcomes: StoryObj<typeof meta> = {
  args: {
    variant: 'zone-outcomes',
    sources: [
      { value: 0.5, color: 'var(--cyan)', label: 'HABITS' },
      { value: 0.5, color: 'var(--violet)', label: 'SLEEP' },
    ],
    targets: [
      { value: 0.45, color: 'var(--zone-high)', label: 'GOOD' },
      { value: 0.35, color: 'var(--zone-mid)', label: 'OK' },
      { value: 0.2, color: 'var(--zone-low)', label: 'ROUGH' },
    ],
    links: [
      l(0, 0, 0.6, 0.6),
      l(0, 1, 0.3, 0.4),
      l(0, 2, 0.1, 0.25),
      l(1, 0, 0.35, 0.4),
      l(1, 1, 0.35, 0.6),
      l(1, 2, 0.3, 0.75),
    ],
  },
};

/** SK-06 three-stage — sources → stages → outcomes (3 columns; the mid→right
 *  ribbon colors reproduce the catalog's TRIO-by-source-index paint). */
export const SK06ThreeStage: StoryObj<typeof meta> = {
  args: {
    variant: 'three-stage',
    sources: [{ value: 0.55 }, { value: 0.45 }],
    stages: [
      { value: 0.4, color: 'var(--cyan)' },
      { value: 0.35, color: 'var(--indigo)' },
      { value: 0.25, color: 'var(--violet)' },
    ],
    targets: [
      { value: 0.6, color: 'var(--mint)' },
      { value: 0.4, color: 'var(--zone-low)' },
    ],
    preLinks: [l(0, 0, 0.6, 0.8), l(0, 1, 0.4, 0.6), l(1, 1, 0.35, 0.4), l(1, 2, 0.65, 1)],
    links: [
      { ...l(0, 0, 1, 0.55), color: 'var(--mint)' },
      { ...l(1, 0, 0.6, 0.45), color: 'var(--cyan)' },
      { ...l(1, 1, 0.4, 0.35), color: 'var(--cyan)' },
      { ...l(2, 1, 1, 0.65), color: 'var(--violet)' },
    ],
  },
};

/** SK-09 highlight-path — one ribbon 85% · rest dimmed to 14%. */
export const SK09HighlightPath: StoryObj<typeof meta> = {
  args: {
    variant: 'highlight-path',
    sources: [{ value: 0.5 }, { value: 0.5 }],
    targets: [{ value: 0.45 }, { value: 0.55 }],
    links: [l(0, 0, 0.6, 0.6), l(0, 1, 0.4, 0.35), l(1, 0, 0.3, 0.4), l(1, 1, 0.7, 0.65)],
    highlight: 1,
  },
};

/** SK-10 labeled-nodes — chip-pill labels on both node columns. */
export const SK10LabeledNodes: StoryObj<typeof meta> = {
  args: {
    variant: 'labeled-nodes',
    sources: [
      { value: 0.6, label: 'SLEEP' },
      { value: 0.4, label: 'TRAINING' },
    ],
    targets: [
      { value: 0.55, label: 'ENERGY' },
      { value: 0.45, label: 'STRAIN' },
    ],
    links: [l(0, 0, 0.75, 0.7), l(0, 1, 0.25, 0.3), l(1, 0, 0.3, 0.3), l(1, 1, 0.7, 0.7)],
  },
};

/** SK-11 thin-streams — many small sources stream into 2 outcomes · 4 hues. */
export const SK11ThinStreams: StoryObj<typeof meta> = {
  args: {
    variant: 'thin-streams',
    sources: [
      { value: 0.28, color: 'var(--lime)', label: 'SLEEP' },
      { value: 0.26, color: 'var(--mint)', label: 'FOOD' },
      { value: 0.24, color: 'var(--cyan)', label: 'TRAIN' },
      { value: 0.22, color: 'var(--violet)', label: 'SUN' },
    ],
    targets: [
      { value: 0.55, color: 'var(--mint)', label: 'ENERGY' },
      // the catalog card's rgba(255,255,255,0.25) sink = --text @ 25%
      { value: 0.45, color: 'color-mix(in srgb, var(--text) 25%, transparent)', label: 'LOST' },
    ],
    links: [
      l(0, 0, 1, 0.3),
      l(1, 0, 0.8, 0.25),
      l(1, 1, 0.2, 0.15),
      l(2, 0, 0.6, 0.25),
      l(2, 1, 0.4, 0.3),
      l(3, 0, 0.4, 0.2),
      l(3, 1, 0.6, 0.55),
    ],
  },
};

/** SK-13 chord-factors — 5 factor nodes on a circle · chords through the
 *  center, width = link strength, source-colored 30% + glow dots + chips. */
export const SK13ChordFactors: StoryObj<typeof meta> = {
  args: { variant: 'chord-factors', factors, chords, title: 'FACTOR LINKS · 30D' },
};

/** SK-01 ribbonStyle SELECT — `spectrum`: one spectrum hue per link index. */
export const SK01RibbonSpectrum: StoryObj<typeof meta> = {
  args: { sources: duoSources, targets: duoTargets, links: duoLinks, ribbonStyle: 'spectrum' },
};

/** SK-01 ribbonStyle SELECT — `glass`: frosted text-white ribbons at 14%. */
export const SK01RibbonGlass: StoryObj<typeof meta> = {
  args: { sources: duoSources, targets: duoTargets, links: duoLinks, ribbonStyle: 'glass' },
};

/** SK-01 ribbonStyle SELECT — `gradient`: src→dst linear gradient at 55%. */
export const SK01RibbonGradient: StoryObj<typeof meta> = {
  args: { sources: duoSources, targets: duoTargets, links: duoLinks, ribbonStyle: 'gradient' },
};

/** The catalog glow modifier — blurred ribbon underlay in the ribbon color. */
export const Shine: StoryObj<typeof meta> = {
  args: { sources: duoSources, targets: duoTargets, links: duoLinks, shine: true },
};

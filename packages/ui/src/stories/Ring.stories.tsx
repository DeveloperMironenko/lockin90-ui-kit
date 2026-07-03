import type { Meta, StoryObj } from '@storybook/react-vite';
import { gradients } from '@lockin90/tokens';
import { Ring } from '../components/Ring';

const meta = {
  title: 'Primitives/Ring',
  component: Ring,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Ring>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Gradient: StoryObj<typeof meta> = {
  args: { gradient: ['#7C5CFF', '#A8FF35'], value: 84 },
};

/** Full flux spectrum — an N-stop gradient arc (lime→mint→cyan→violet→magenta). */
export const FluxSpectrum: StoryObj<typeof meta> = {
  args: { gradient: [...gradients.flux.stops], value: 88, size: 132, thickness: 9 },
};

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Ring size={64} value={38} color="var(--zone-low)" thickness={5} />
      <Ring size={90} value={64} color="var(--cyan)" thickness={6} />
      <Ring size={120} value={88} color="var(--mint)" thickness={8} />
    </div>
  ),
};

/* ---- catalog reproductions (donut-charts DN-01…DN-09) -------------------- */

/** DN-01 score-ring — r52-scale ring, 11px round-cap arc + center stat.
 *  SELECT ARC: any token / gradient (lime→mint→cyan). */
export const DN01ScoreRing: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Ring value={74} size={116} thickness={11} color="var(--mint)" />
      <Ring value={74} size={116} thickness={11} gradient={['var(--lime)', 'var(--mint)', 'var(--cyan)']} />
    </div>
  ),
};

/** DN-03 zone-ring — arc + number colored by value zone (36 → coral). */
export const DN03ZoneRing: StoryObj<typeof meta> = {
  args: { value: 36, zone: true, size: 116, thickness: 11 },
};

/** DN-04 dual-ring — concentric mint + violet · shared center stat. */
export const DN04DualRing: StoryObj<typeof meta> = {
  args: { variant: 'dual', value: 78, value2: 55, size: 128, thickness: 10 },
};

/** DN-05 triple-ring — activity-style: mint 82 · cyan 64 · violet 45. */
export const DN05TripleRing: StoryObj<typeof meta> = {
  args: { variant: 'triple', value: 82, value2: 64, value3: 45, size: 128, thickness: 9 },
};

/** DN-06 thin-halo — 4px thin ring, quiet, avatar-badge scale. */
export const DN06ThinHalo: StoryObj<typeof meta> = {
  args: { variant: 'thin-halo', value: 68, color: 'var(--cyan)', size: 116 },
};

/** DN-07 dashed-track — dotted 2-5 track · solid round-cap arc on top. */
export const DN07DashedTrack: StoryObj<typeof meta> = {
  args: { variant: 'dashed-track', value: 57, color: 'var(--violet)', size: 116, thickness: 11 },
};

/** DN-08 pulse-ring — pulsing dot rides the arc end (reduced-motion safe). */
export const DN08PulseRing: StoryObj<typeof meta> = {
  args: { variant: 'pulse', value: 66, color: 'var(--mint)', size: 116, thickness: 11 },
};

/** DN-09 delta-ring — score ring + mint delta chip under the center. */
export const DN09DeltaRing: StoryObj<typeof meta> = {
  args: { value: 71, delta: '+6 VS YESTERDAY', size: 132, thickness: 11 },
};

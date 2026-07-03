import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors, gradients } from '@lockin90/tokens';
import { Ring } from '../components/Ring';

const meta = { title: 'Native/Ring' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Ring value={72} size={88} />,
};

export const Gradient: Story = {
  render: () => <Ring value={84} size={88} gradient={['#7C5CFF', '#A8FF35']} />,
};

/** Full flux spectrum — an N-stop gradient arc (lime→mint→cyan→violet→magenta). */
export const FluxSpectrum: Story = {
  render: () => <Ring value={88} size={132} thickness={9} gradient={[...gradients.flux.stops]} />,
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
      <Ring size={64} value={40} color="#FF4D6D" thickness={5} />
      <Ring size={90} value={64} color="#22D3EE" thickness={6} />
      <Ring size={120} value={88} color="#34F5C5" thickness={8} />
    </View>
  ),
};

/* ---- catalog reproductions (donut-charts DN-01…DN-09) -------------------- */

/** DN-01 score-ring — r52-scale ring, 11px round-cap arc + center stat.
 *  SELECT ARC: any token / gradient (lime→mint→cyan). */
export const DN01ScoreRing: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
      <Ring value={74} size={116} thickness={11} color={colors.mint} />
      <Ring value={74} size={116} thickness={11} gradient={[colors.lime, colors.mint, colors.cyan]} />
    </View>
  ),
};

/** DN-03 zone-ring — arc + number colored by value zone (36 → coral). */
export const DN03ZoneRing: Story = {
  render: () => <Ring value={36} zone size={116} thickness={11} />,
};

/** DN-04 dual-ring — concentric mint + violet · shared center stat. */
export const DN04DualRing: Story = {
  render: () => <Ring variant="dual" value={78} value2={55} size={128} thickness={10} />,
};

/** DN-05 triple-ring — activity-style: mint 82 · cyan 64 · violet 45. */
export const DN05TripleRing: Story = {
  render: () => <Ring variant="triple" value={82} value2={64} value3={45} size={128} thickness={9} />,
};

/** DN-06 thin-halo — 4px thin ring, quiet, avatar-badge scale. */
export const DN06ThinHalo: Story = {
  render: () => <Ring variant="thin-halo" value={68} color={colors.cyan} size={116} />,
};

/** DN-07 dashed-track — dotted 2-5 track · solid round-cap arc on top. */
export const DN07DashedTrack: Story = {
  render: () => (
    <Ring variant="dashed-track" value={57} color={colors.violet} size={116} thickness={11} />
  ),
};

/** DN-08 pulse-ring — dot marks the arc end (static halo on native). */
export const DN08PulseRing: Story = {
  render: () => <Ring variant="pulse" value={66} color={colors.mint} size={116} thickness={11} />,
};

/** DN-09 delta-ring — score ring + mint delta chip under the center. */
export const DN09DeltaRing: Story = {
  render: () => <Ring value={71} delta="+6 VS YESTERDAY" size={132} thickness={11} />,
};

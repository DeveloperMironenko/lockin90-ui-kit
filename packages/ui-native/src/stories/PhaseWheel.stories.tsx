import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PhaseWheel } from '../components/PhaseWheel';

const meta = { title: 'Native/PhaseWheel' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** Defaults: sleep / peak-focus / dip / wind-down bands, wake + melatonin
 *  markers, a "now" hand at 2:30p, hour ticks, center shows the current time. */
export const Default: Story = {
  render: () => <PhaseWheel />,
};

/** Same wheel with no "now" hand (`now={null}`) — center falls back to '24h'. */
export const NoHand: Story = {
  render: () => <PhaseWheel now={null} />,
};

/** Bare ring: phase bands only — no hour ticks, no markers. */
export const Minimal: Story = {
  render: () => <PhaseWheel hourTicks={false} markers={[]} />,
};

/** CW-01 `phase-wheel` — the 28-day cycle: 4 phase arcs (coral/cyan/lime/violet,
 *  round caps, gaps), D-labels, today dot at D21, center DAY 21 / LUTEAL +
 *  phase legend. All defaults — reproduces the catalog card. */
export const CW01PhaseWheel: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PhaseWheel variant="phase-wheel" />
    </View>
  ),
};

/** CW-01 FOCUS — the focused phase stays full-strength, the others dim to 20%,
 *  and the center shows the days left in it (D21 in luteal → 7d). */
export const CW01Focus: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PhaseWheel variant="phase-wheel" focusPhase="Luteal" />
    </View>
  ),
};

/** CW-01 + `shine` — a wider faint duplicate arc behind each phase (the catalog
 *  glow modifier; no SVG filters on native). */
export const CW01Shine: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PhaseWheel variant="phase-wheel" shine />
    </View>
  ),
};

/** CW-04 `coach-wheel` — the wheel + a violet recommendation pill under it
 *  ("LUTEAL — LOWER INTENSITY, MORE SLEEP"). Center shows the short D21 form. */
export const CW04CoachWheel: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PhaseWheel variant="coach-wheel" />
    </View>
  ),
};

/** CW-05 `phase-strip` — the wheel unrolled: 4 phase pills on a linear 28-day
 *  strip + TODAY rule at D21 + D-ticks. */
export const CW05PhaseStrip: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PhaseWheel variant="phase-strip" width={340} />
    </View>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhaseWheel } from '../components/PhaseWheel';

const meta = {
  title: 'Primitives/PhaseWheel',
  component: PhaseWheel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PhaseWheel>;
export default meta;

/** Defaults: sleep / peak-focus / dip / wind-down bands, wake + melatonin
 *  markers, a "now" hand at 2:30p, hour ticks, center shows the current time. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** Same wheel with no "now" hand (`now={null}`) — center falls back to '24h'. */
export const NoHand: StoryObj<typeof meta> = { args: { now: null } };

/** Bare ring: phase bands only — no hour ticks, no markers. */
export const Minimal: StoryObj<typeof meta> = { args: { hourTicks: false, markers: [] } };

/** CW-01 `phase-wheel` — the 28-day cycle: 4 phase arcs (coral/cyan/lime/violet,
 *  round caps, gaps), D-labels, today pulse at D21, center DAY 21 / LUTEAL +
 *  phase legend. All defaults — reproduces the catalog card. */
export const CW01PhaseWheel: StoryObj<typeof meta> = { args: { variant: 'phase-wheel' } };

/** CW-01 FOCUS — the focused phase stays full-strength, the others dim to 20%,
 *  and the center shows the days left in it (D21 in luteal → 7d). */
export const CW01Focus: StoryObj<typeof meta> = {
  args: { variant: 'phase-wheel', focusPhase: 'Luteal' },
};

/** CW-01 + `shine` — soft glow behind the phase arcs (the catalog glow modifier). */
export const CW01Shine: StoryObj<typeof meta> = {
  args: { variant: 'phase-wheel', shine: true },
};

/** CW-04 `coach-wheel` — the wheel + a violet recommendation pill under it
 *  ("LUTEAL — LOWER INTENSITY, MORE SLEEP"). Center shows the short D21 form. */
export const CW04CoachWheel: StoryObj<typeof meta> = { args: { variant: 'coach-wheel' } };

/** CW-05 `phase-strip` — the wheel unrolled: 4 phase pills on a linear 28-day
 *  strip + TODAY rule at D21 + D-ticks. */
export const CW05PhaseStrip: StoryObj<typeof meta> = { args: { variant: 'phase-strip' } };

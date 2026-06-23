import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhaseWheel } from '../components/PhaseWheel';

const meta = {
  title: 'Primitives/PhaseWheel',
  component: PhaseWheel,
} satisfies Meta<typeof PhaseWheel>;
export default meta;

/** Defaults: sleep / peak-focus / dip / wind-down bands, wake + melatonin
 *  markers, a "now" hand at 2:30p, hour ticks, center shows the current time. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** Same wheel with no "now" hand (`now={null}`) — center falls back to '24h'. */
export const NoHand: StoryObj<typeof meta> = { args: { now: null } };

/** Bare ring: phase bands only — no hour ticks, no markers. */
export const Minimal: StoryObj<typeof meta> = { args: { hourTicks: false, markers: [] } };

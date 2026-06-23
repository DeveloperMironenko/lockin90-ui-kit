import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
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

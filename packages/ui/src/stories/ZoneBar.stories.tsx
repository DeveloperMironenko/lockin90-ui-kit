import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZoneBar, type ZoneBarZone } from '../components/ZoneBar';

const meta = {
  title: 'Primitives/ZoneBar',
  component: ZoneBar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ZoneBar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A typical 5-zone HR session — minutes in each zone (Z1..Z5). */
const SESSION: ZoneBarZone[] = [
  { value: 8 }, // Z1
  { value: 6 }, // Z2
  { value: 12 }, // Z3
  { value: 3 }, // Z4
  { value: 1 }, // Z5
];

/** Five zones, weighted by time, no active marker. */
export const Default: Story = { args: { zones: SESSION } };

/** The athlete is currently in Z3 → that zone lights up + a marker tick. */
export const WithCurrent: Story = { args: { zones: SESSION, current: 2 } };

/** Z1..Z5 labels under the bar, with the current zone highlighted. */
export const WithLabels: Story = { args: { zones: SESSION, current: 2, showLabels: true } };

/** A hard interval session pushing into Z5. */
export const HighIntensity: Story = {
  args: {
    zones: [{ value: 3 }, { value: 5 }, { value: 9 }, { value: 11 }, { value: 7 }],
    current: 4,
    showLabels: true,
    height: 12,
  },
};

/** Empty state — no time logged yet: five equal, dimmed zones. */
export const Empty: Story = {
  args: {
    zones: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    showLabels: true,
  },
};

/** Custom labels override the default Z1..Z5. */
export const CustomLabels: Story = {
  args: {
    zones: [
      { value: 8, label: 'Rec' },
      { value: 6, label: 'Easy' },
      { value: 12, label: 'Aero' },
      { value: 3, label: 'Thr' },
      { value: 1, label: 'Max' },
    ],
    current: 2,
    showLabels: true,
  },
};

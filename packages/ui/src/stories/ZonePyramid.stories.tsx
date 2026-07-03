import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ZonePyramid } from '../components/ZonePyramid';

/* The component's default zones ARE the catalog demo data
   (lockin90-design/charts/pyramid-charts.html ZONES — minutes 36/72/118/195/250
   with the card's %/h:mm labels), so the stories reproduce the design cards
   and parity is verifiable by eye. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/ZonePyramid',
  component: ZonePyramid,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof ZonePyramid>;
export default meta;

/** PY-01 zone-pyramid — THE weekly intensity-distribution card: centered bars
 *  Z5→Z1 (coral/amber/lime/mint/cyan), width = time, % left / h:mm right,
 *  zone letter inside wide bars. */
export const PY01ZonePyramid: StoryObj<typeof meta> = {
  args: {
    variant: 'zone-pyramid',
    title: 'TIME IN ZONE · WEEK',
    caption: '9H 11M TOTAL · BASE-HEAVY = GOOD',
  },
};

/** PY-02 target-pyramid — dashed white 80/20 target outline per zone + the
 *  derived amber 'Z3 +40M OVER' pill at the worst overage. */
export const PY02TargetPyramid: StoryObj<typeof meta> = {
  args: {
    variant: 'target-pyramid',
    title: 'VS POLARIZED PLAN',
    caption: 'DASHED = 80/20 POLARIZED TARGET',
  },
};

/** PY-03 mirror-pyramid — population-pyramid layout: this week right (solid)
 *  vs last week left (32%), zone letters on the spine + derived delta pill. */
export const PY03MirrorPyramid: StoryObj<typeof meta> = {
  args: { variant: 'mirror-pyramid', title: 'WEEK VS WEEK' },
};

/** Real-data example — minutes only; %, h:mm, total caption all derive. */
export const PY01Derived: StoryObj<typeof meta> = {
  args: {
    variant: 'zone-pyramid',
    title: 'TIME IN ZONE · WEEK',
    zones: [
      { label: 'Z5', minutes: 24 },
      { label: 'Z4', minutes: 58 },
      { label: 'Z3', minutes: 96 },
      { label: 'Z2', minutes: 170 },
      { label: 'Z1', minutes: 232 },
    ],
  },
};

/** The catalog glow modifier — soft underlay behind each bar. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'zone-pyramid', title: 'TIME IN ZONE · WEEK', caption: '', shine: true },
};

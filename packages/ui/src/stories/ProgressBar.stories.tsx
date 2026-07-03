import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../components/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  // ProgressBar is width:100% — give it a real width so it doesn't collapse
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Determinate: Story = { args: { value: 0.73 } };

export const WithLabelAndValue: Story = {
  args: { value: 0.73, label: 'Syncing history', showValue: true },
};

export const Indeterminate: Story = { args: { label: 'Loading' } };

export const Showcase: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ProgressBar value={0.2} />
      <ProgressBar value={0.5} label="Determinate" showValue />
      <ProgressBar value={0.85} height={12} />
      <ProgressBar value={1} label="Complete" showValue />
      <ProgressBar label="Indeterminate" />
      <ProgressBar height={4} gradient="var(--grad-cta)" rounded={false} value={0.4} />
    </div>
  ),
};

/* ----------------------------------------------------------------------------
   Catalog variants — each story reproduces the design-catalog card
   (lockin90-design/charts/progress-charts.html) on the 320px card width.
   -------------------------------------------------------------------------- */

/** PL-01 `progress` — title+%+sub row, mint fill. */
export const PL01Progress: Story = {
  args: {
    variant: 'progress',
    value: 0.72,
    color: 'var(--mint)',
    label: 'PROTEIN · 130G TARGET',
    sub: '94 g logged · 36 g to go',
  },
};

/** PL-01 SELECTs — heights 3 hairline / 8 default / 18 thick, colors + gradient. */
export const PL01ColorsAndHeights: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ProgressBar variant="progress" value={0.72} height={3} label="HAIRLINE · 3PX" color="var(--mint)" />
      <ProgressBar variant="progress" value={0.72} height={8} label="DEFAULT · 8PX" color="var(--cyan)" />
      <ProgressBar variant="progress" value={0.72} height={18} label="THICK · 18PX" color="var(--violet)" />
      <ProgressBar variant="progress" value={0.72} label="GRADIENT" gradient="var(--grad-mint)" />
      <ProgressBar variant="progress" value={0.72} label="SHINE" color="var(--mint)" shine />
    </div>
  ),
};

/** PL-04 `zone-progress` — fill + % colored by value zone (0.34 → coral). */
export const PL04ZoneProgress: Story = {
  args: {
    variant: 'zone-progress',
    value: 0.34,
    label: 'HYDRATION',
    sub: '0.9 L of 2.6 L',
  },
};

/** PL-08 `step-cells` — 10 cells, filled = done, counter under. */
export const PL08StepCells: Story = {
  args: {
    variant: 'step-cells',
    value: 0.7,
    steps: 10,
    height: 10,
    color: 'var(--mint)',
    label: 'HABIT STREAK · THIS WEEK',
  },
};

/** PL-09 `milestone-line` — ticks + dots at 25/50/75, lit when passed. */
export const PL09MilestoneLine: Story = {
  args: {
    variant: 'milestone-line',
    value: 0.61,
    color: 'var(--cyan)',
    label: 'ONBOARDING',
    sub: 'profile · devices · apps · done',
  },
};

/** PL-11 `ghost-compare` — white-16% ghost layer under = previous period. */
export const PL11GhostCompare: Story = {
  args: {
    variant: 'ghost-compare',
    value: 0.66,
    ghost: 0.52,
    color: 'var(--cyan)',
    label: 'WEEKLY VOLUME',
    sub: 'vs last week (ghost)',
  },
};

/** PL-13 `overflow-badge` — fill caps at 100% + lime "+12 OVER" pill. */
export const PL13OverflowBadge: Story = {
  args: {
    variant: 'overflow-badge',
    value: 1.12,
    color: 'var(--lime)',
    label: 'STEP GOAL',
    sub: '11,2k of 10k',
  },
};

/** PL-14 `head-pill` — chip-pill with % rides the fill head. */
export const PL14HeadPill: Story = {
  args: {
    variant: 'head-pill',
    value: 0.47,
    color: 'var(--violet)',
    label: 'FOCUS BLOCKS',
  },
};

/** PL-16 `countdown-drain` — coral fill drains right→left (time remaining). */
export const PL16CountdownDrain: Story = {
  args: {
    variant: 'countdown-drain',
    value: 0.31,
    label: 'CAFFEINE WINDOW',
    sub: 'closes in 1 h 10 m',
  },
};

/** GOAL tick option — amber target rule + pill on any linear variant. */
export const GoalTick: Story = {
  args: {
    variant: 'progress',
    value: 0.54,
    color: 'var(--mint)',
    label: 'WEEKLY SESSIONS',
    target: 0.68,
  },
};

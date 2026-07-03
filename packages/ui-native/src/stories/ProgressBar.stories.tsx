import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors, gradients } from '@lockin90/tokens';
import { ProgressBar } from '../components/ProgressBar';

const meta = { title: 'Native/ProgressBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Determinate: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar value={0.73} />
    </View>
  ),
};

export const WithLabelAndValue: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar value={0.73} label="Syncing history" showValue />
    </View>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar label="Loading" />
    </View>
  ),
};

export const Showcase: Story = {
  render: () => (
    <View style={{ width: 320, gap: 20 }}>
      <ProgressBar value={0.2} />
      <ProgressBar value={0.5} label="Determinate" showValue />
      <ProgressBar value={0.85} height={12} />
      <ProgressBar value={1} label="Complete" showValue />
      <ProgressBar label="Indeterminate" />
      <ProgressBar height={4} gradient={['#7C5CFF', '#22D3EE']} rounded={false} value={0.4} />
    </View>
  ),
};

/* ----------------------------------------------------------------------------
   Catalog variants — each story reproduces the design-catalog card
   (lockin90-design/charts/progress-charts.html) on the 320px card width.
   -------------------------------------------------------------------------- */

/** PL-01 `progress` — title+%+sub row, mint fill. */
export const PL01Progress: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar
        variant="progress"
        value={0.72}
        color={colors.mint}
        label="PROTEIN · 130G TARGET"
        sub="94 g logged · 36 g to go"
      />
    </View>
  ),
};

/** PL-01 SELECTs — heights 3 hairline / 8 default / 18 thick, colors + gradient. */
export const PL01ColorsAndHeights: Story = {
  render: () => (
    <View style={{ width: 320, gap: 24 }}>
      <ProgressBar variant="progress" value={0.72} height={3} label="HAIRLINE · 3PX" color={colors.mint} />
      <ProgressBar variant="progress" value={0.72} height={8} label="DEFAULT · 8PX" color={colors.cyan} />
      <ProgressBar variant="progress" value={0.72} height={18} label="THICK · 18PX" color={colors.violet} />
      <ProgressBar
        variant="progress"
        value={0.72}
        label="GRADIENT"
        gradient={[gradients.mint.stops[0], gradients.mint.stops[1]]}
      />
      <ProgressBar variant="progress" value={0.72} label="SHINE" color={colors.mint} shine />
    </View>
  ),
};

/** PL-04 `zone-progress` — fill + % colored by value zone (0.34 → coral). */
export const PL04ZoneProgress: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar variant="zone-progress" value={0.34} label="HYDRATION" sub="0.9 L of 2.6 L" />
    </View>
  ),
};

/** PL-08 `step-cells` — 10 cells, filled = done, counter under. */
export const PL08StepCells: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar
        variant="step-cells"
        value={0.7}
        steps={10}
        height={10}
        color={colors.mint}
        label="HABIT STREAK · THIS WEEK"
      />
    </View>
  ),
};

/** PL-09 `milestone-line` — ticks + dots at 25/50/75, lit when passed. */
export const PL09MilestoneLine: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar
        variant="milestone-line"
        value={0.61}
        color={colors.cyan}
        label="ONBOARDING"
        sub="profile · devices · apps · done"
      />
    </View>
  ),
};

/** PL-11 `ghost-compare` — white-16% ghost layer under = previous period. */
export const PL11GhostCompare: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar
        variant="ghost-compare"
        value={0.66}
        ghost={0.52}
        color={colors.cyan}
        label="WEEKLY VOLUME"
        sub="vs last week (ghost)"
      />
    </View>
  ),
};

/** PL-13 `overflow-badge` — fill caps at 100% + lime "+12 OVER" pill. */
export const PL13OverflowBadge: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar variant="overflow-badge" value={1.12} color={colors.lime} label="STEP GOAL" sub="11,2k of 10k" />
    </View>
  ),
};

/** PL-14 `head-pill` — chip-pill with % rides the fill head. */
export const PL14HeadPill: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar variant="head-pill" value={0.47} color={colors.violet} label="FOCUS BLOCKS" />
    </View>
  ),
};

/** PL-16 `countdown-drain` — coral fill drains right→left (time remaining). */
export const PL16CountdownDrain: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar variant="countdown-drain" value={0.31} label="CAFFEINE WINDOW" sub="closes in 1 h 10 m" />
    </View>
  ),
};

/** GOAL tick option — amber target rule + pill on any linear variant. */
export const GoalTick: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar variant="progress" value={0.54} color={colors.mint} label="WEEKLY SESSIONS" target={0.68} />
    </View>
  ),
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, NumberStepper } from '../components/Stepper';

const meta = {
  title: 'Primitives/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Stepper>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

/** Original 30px filled rail — explicit `variant="compact"` (matches default). */
export const Compact: StoryObj<typeof meta> = {
  args: { variant: 'compact' },
};

/** Onboarding "Complete" — current (final) node also reads done; whole rail finished. */
export const Complete: StoryObj<typeof meta> = {
  args: { current: 3, complete: true },
};

/** Onboarding tracker variant — 40px nodes, hollow mint "done", pulsing CTA
 *  "current", mint connectors. Mid-progress (step 3 of 4). */
export const Glow: StoryObj<typeof meta> = {
  args: {
    variant: 'glow',
    current: 2,
    steps: [
      { label: 'Connect' },
      { label: 'Permissions' },
      { label: 'Goals' },
      { label: 'Review' },
    ],
  },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ width: 560 }}>
      <Stepper {...args} />
    </div>
  ),
};

/** Click-to-navigate — `onStepClick` makes each node a focusable `<button>`.
 *  Done + current nodes are interactive; future nodes are disabled so users
 *  can't jump ahead. Click (or focus + ENTER/SPACE) a node to seek the rail. */
export const Interactive: StoryObj<typeof meta> = {
  parameters: { layout: 'padded' },
  render: () => {
    const steps = [
      { label: 'Connect' },
      { label: 'Permissions' },
      { label: 'Goals' },
      { label: 'Review' },
    ];
    const [current, setCurrent] = useState(2);
    return (
      <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Stepper
          variant="glow"
          steps={steps}
          current={current}
          onStepClick={(i) => setCurrent(i)}
        />
        <div style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.7 }}>
          current = {current} ({steps[current]?.label})
        </div>
      </div>
    );
  },
};

export const Quantity: StoryObj<typeof meta> = {
  render: () => <NumberStepper />,
};

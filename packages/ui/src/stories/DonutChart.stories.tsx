import type { Meta, StoryObj } from '@storybook/react-vite';
import { DonutChart } from '../components/DonutChart';

const meta = {
  title: 'Primitives/DonutChart',
  component: DonutChart,
} satisfies Meta<typeof DonutChart>;
export default meta;

/** Defaults: 50/30/20 cyan·lime·violet, center shows the summed total. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** A big Ring-style number + label in the center via `children`. */
export const WithCenter: StoryObj<typeof meta> = {
  render: (args) => (
    <DonutChart {...args} size={160} thickness={18}>
      <span
        className="lk-display lk-tnum"
        style={{ fontSize: 40, lineHeight: 1, color: 'var(--text)' }}
      >
        76
      </span>
      <span
        className="lk-mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        score
      </span>
    </DonutChart>
  ),
};

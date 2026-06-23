import type { Meta, StoryObj } from '@storybook/react-vite';
import { ForecastCallout } from '../components/ForecastCallout';

const meta = {
  title: 'Primitives/ForecastCallout',
  component: ForecastCallout,
} satisfies Meta<typeof ForecastCallout>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chip: 'Forecast',
    icon: 'sparkle',
    children: (
      <>
        <b>31-day outlook</b> trends steady — no major swings projected this
        cycle.
      </>
    ),
  },
};

export const PositivePeak: Story = {
  args: {
    tone: 'positive',
    chip: 'peak',
    children: (
      <>
        <b>Projected 88</b> on Fri, Jun 26 — deload week. Best max-effort window.
      </>
    ),
  },
};

export const NegativeDip: Story = {
  args: {
    tone: 'negative',
    chip: 'dip',
    children: (
      <>
        <b>Dips to 54</b> on Tue, Jun 16 — back-to-back meetings + short sleep.
      </>
    ),
  },
};

export const Warn: Story = {
  args: {
    tone: 'warn',
    chip: 'caution',
    icon: 'warning',
    children: (
      <>
        <b>Recovery lagging</b> — three high-strain days in a row may flatten
        your peak.
      </>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from '../components/Countdown';

const meta = {
  title: 'Primitives/Countdown',
  component: Countdown,
} satisfies Meta<typeof Countdown>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { parts: { days: 12, hours: 7, minutes: 41, seconds: 9 }, highlightUnit: 'minutes' },
};

export const Live: Story = {
  args: { to: Date.now() + 1000 * 60 * 60 * 26 + 1000 * 40, highlightUnit: 'seconds' },
};

export const MaintenanceEta: Story = {
  args: { parts: { hours: 0, minutes: 23, seconds: 40 }, units: ['hours', 'minutes', 'seconds'], highlightUnit: 'minutes' },
};

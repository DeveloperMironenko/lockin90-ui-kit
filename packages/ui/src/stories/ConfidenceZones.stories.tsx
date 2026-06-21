import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfidenceZones } from '../components/ConfidenceZones';

const meta = {
  title: 'Components/ConfidenceZones',
  component: ConfidenceZones,
} satisfies Meta<typeof ConfidenceZones>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedDonut } from '../components/SegmentedDonut';

const meta = {
  title: 'Components/SegmentedDonut',
  component: SegmentedDonut,
} satisfies Meta<typeof SegmentedDonut>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

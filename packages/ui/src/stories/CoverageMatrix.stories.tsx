import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoverageMatrix } from '../components/CoverageMatrix';

const meta = {
  title: 'Components/CoverageMatrix',
  component: CoverageMatrix,
} satisfies Meta<typeof CoverageMatrix>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

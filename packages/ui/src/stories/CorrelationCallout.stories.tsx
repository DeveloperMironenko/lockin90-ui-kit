import type { Meta, StoryObj } from '@storybook/react-vite';
import { CorrelationCallout } from '../components/CorrelationCallout';

const meta = {
  title: 'Components/CorrelationCallout',
  component: CorrelationCallout,
} satisfies Meta<typeof CorrelationCallout>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaffeineDecayCurve } from '../components/CaffeineDecayCurve';

const meta = {
  title: 'Components/CaffeineDecayCurve',
  component: CaffeineDecayCurve,
} satisfies Meta<typeof CaffeineDecayCurve>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

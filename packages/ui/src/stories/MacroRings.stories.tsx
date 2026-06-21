import type { Meta, StoryObj } from '@storybook/react-vite';
import { MacroRings } from '../components/MacroRings';

const meta = {
  title: 'Components/MacroRings',
  component: MacroRings,
} satisfies Meta<typeof MacroRings>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

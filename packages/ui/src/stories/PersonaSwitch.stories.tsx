import type { Meta, StoryObj } from '@storybook/react-vite';
import { PersonaSwitch } from '../components/PersonaSwitch';

const meta = {
  title: 'Components/PersonaSwitch',
  component: PersonaSwitch,
} satisfies Meta<typeof PersonaSwitch>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

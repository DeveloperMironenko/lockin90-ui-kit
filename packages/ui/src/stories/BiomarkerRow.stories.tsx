import type { Meta, StoryObj } from '@storybook/react-vite';
import { BiomarkerRow } from '../components/BiomarkerRow';

const meta = {
  title: 'Components/BiomarkerRow',
  component: BiomarkerRow,
} satisfies Meta<typeof BiomarkerRow>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { InstructionList } from '../components/InstructionList';

const meta = {
  title: 'Components/InstructionList',
  component: InstructionList,
} satisfies Meta<typeof InstructionList>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

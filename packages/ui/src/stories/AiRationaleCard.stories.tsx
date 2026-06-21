import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiRationaleCard } from '../components/AiRationaleCard';

const meta = {
  title: 'Components/AiRationaleCard',
  component: AiRationaleCard,
} satisfies Meta<typeof AiRationaleCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

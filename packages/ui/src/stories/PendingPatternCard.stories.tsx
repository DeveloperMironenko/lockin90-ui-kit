import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingPatternCard } from '../components/PendingPatternCard';

const meta = {
  title: 'Components/PendingPatternCard',
  component: PendingPatternCard,
} satisfies Meta<typeof PendingPatternCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AthleteRosterCard } from '../components/AthleteRosterCard';

const meta = {
  title: 'Components/AthleteRosterCard',
  component: AthleteRosterCard,
} satisfies Meta<typeof AthleteRosterCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContributionStrip } from '../components/ContributionStrip';

const meta = {
  title: 'Components/ContributionStrip',
  component: ContributionStrip,
} satisfies Meta<typeof ContributionStrip>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

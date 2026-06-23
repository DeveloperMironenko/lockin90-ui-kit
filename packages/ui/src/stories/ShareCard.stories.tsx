import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareCard } from '../components/ShareCard';

const meta = {
  title: 'Primitives/ShareCard',
  component: ShareCard,
} satisfies Meta<typeof ShareCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Square: Story = {
  args: {
    title: 'Energy Score',
    value: '87',
    ring: 0.87,
    subtitle: 'Best energy week in a month. Locked in.',
    gradient: 'flux',
    brand: true,
    device: 'oura',
    aspect: 'square',
  },
};

export const StoryAspect: Story = {
  args: {
    title: 'Today',
    value: '76',
    ring: 0.76,
    subtitle: '7-day average · HIGH zone',
    gradient: 'violet',
    brand: true,
    device: 'whoop',
    aspect: 'story',
  },
};

export const Wide: Story = {
  args: {
    title: 'Weekly Recap',
    value: '91',
    ring: 0.91,
    subtitle: 'Current streak: 23 days',
    gradient: 'mint',
    brand: true,
    aspect: 'wide',
  },
};

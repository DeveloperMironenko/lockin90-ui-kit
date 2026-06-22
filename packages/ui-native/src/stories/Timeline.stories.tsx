import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Timeline } from '../components/Timeline';

const meta = {
  title: 'Native/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {};

export const ProductRoadmap: Story = {
  args: {
    items: [
      { status: 'done', title: 'Private alpha', date: 'Jan 2026', description: 'Core energy engine live for the founding team.' },
      { status: 'done', title: 'Wearable sync', date: 'Mar 2026', description: 'Oura, WHOOP and Apple Health connected.' },
      { status: 'now', title: 'Closed beta', date: 'Today', description: 'Founding athletes shaping the launch build.' },
      { status: 'next', title: 'Public launch', date: 'In 2 months', description: 'Doors open to the waitlist first.' },
    ],
  },
};

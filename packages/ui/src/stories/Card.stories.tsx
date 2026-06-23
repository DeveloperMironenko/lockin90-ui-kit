import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
} satisfies Meta<typeof Card>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'Glass card surface' } };

export const WarnTone: StoryObj<typeof meta> = {
  args: { tone: 'warn', children: 'Your subscription renews in 3 days' },
};

export const DangerTone: StoryObj<typeof meta> = {
  args: { tone: 'danger', children: 'Payment failed — update your card to keep your data' },
};

export const Dashed: StoryObj<typeof meta> = {
  args: { variant: 'dashed', children: '+ Connect a data source' },
};

export const Ghost: StoryObj<typeof meta> = {
  args: { variant: 'ghost', children: 'Borderless transparent surface' },
};

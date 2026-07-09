import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'Glass card surface' } };

export const Lit: StoryObj<typeof meta> = {
  args: { lit: true, children: 'Lit hairline on the top edge' },
};

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

/** Polymorphic `as` — render the same glass surface as a semantic element
 *  (`article` / `li` / `section`). The marketing `Card` is a thin wrapper of this. */
export const AsArticle: StoryObj<typeof meta> = {
  args: { as: 'article', hover: true, children: 'Rendered as an <article> element' },
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Accordion } from '../components/Accordion';

const meta = {
  title: 'Native/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;
export default meta;

type Story = StoryObj<typeof Accordion>;

/** Defaults: a small FAQ sample, single-open with the first row expanded. */
export const Default: Story = {};

/** Allow several rows open at once. */
export const Multiple: Story = { args: { multiple: true } };

export const CustomItems: Story = {
  args: {
    items: [
      { title: 'How accurate are the estimates?', content: 'They improve as you log more sessions.' },
      { title: 'Can I cancel anytime?', content: 'Yes — your plan stays active until the end of the period.' },
      { title: 'Do you support wearables?', content: 'WHOOP, Oura, Apple Health and more.' },
    ],
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Highlight } from '../components/Highlight';

const meta = {
  title: 'Primitives/Highlight',
  component: Highlight,
} satisfies Meta<typeof Highlight>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: '5:40pm espresso', tone: 'accent' } };

export const InProse: StoryObj<typeof meta> = {
  render: () => (
    <p style={{ maxWidth: 560, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 }}>
      From your first <Highlight tone="warm">5 logged days</Highlight>, today's energy estimates to roughly{' '}
      <Highlight tone="warm">71 / 100</Highlight>. We can already see your{' '}
      <Highlight tone="accent">5:40pm espresso</Highlight> in the data. What helps most is to{' '}
      <Highlight tone="mint">keep logging</Highlight> — you're <Highlight tone="mint">2 days</Highlight> from
      the first confirmed insights, and we flag a <Highlight tone="low">post-lunch dip</Highlight>.
    </p>
  ),
};

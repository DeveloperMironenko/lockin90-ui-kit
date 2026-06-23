import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialPost } from '../components/SocialPost';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';

const meta: Meta<typeof SocialPost> = {
  title: 'Primitives/SocialPost',
  component: SocialPost,
  args: {
    author: { name: 'Sofia Lindqvist', handle: 'sofialifts' },
    time: '2h',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SocialPost>;

/** A simple inline engagement footer — in real apps consumers pass <EngagementBar/>. */
function FooterPlaceholder() {
  return (
    <div style={{ display: 'flex', gap: 18, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="star" size={16} /> 128
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={16} /> 24
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="share" size={16} /> 9
      </span>
    </div>
  );
}

/** Author + body + a footer placeholder. */
export const Default: Story = {
  args: {
    body: '30 days in and my average energy went from 61 → 74. The unlock was killing the late caffeine — cut my last coffee to 1pm and the afternoon dips basically vanished.',
    footer: <FooterPlaceholder />,
  },
};

/** With an attached media slot (a branded progress card rendered as-is). */
export const WithMedia: Story = {
  args: {
    author: { name: 'Darius Webb', handle: 'dwebb_strong' },
    time: '4h',
    body: 'Hit it. Forecast called an 88-energy peak window for today and it delivered. Trusting the model now.',
    media: (
      <Card pad="md" flat style={{ background: 'linear-gradient(160deg, rgba(124,92,255,.07), rgba(34,211,238,.04))' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent-2)' }}>
          30-day energy summary
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Best month yet</div>
      </Card>
    ),
    footer: <FooterPlaceholder />,
  },
};

/** With a small badge tag in the header. */
export const WithBadge: Story = {
  args: {
    author: { name: 'Tomás Oliveira', handle: 'tomas.o' },
    time: '14h',
    badge: 'PR',
    body: 'Unlocked "Calibration Master" — model hit 0.90 agreement on my energy. Took 8 weeks of honest logging.',
    footer: <FooterPlaceholder />,
  },
};

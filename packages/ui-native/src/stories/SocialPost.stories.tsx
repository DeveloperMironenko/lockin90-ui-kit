import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { SocialPost } from '../components/SocialPost';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';

const meta: Meta<typeof SocialPost> = {
  title: 'Native/SocialPost',
  component: SocialPost,
  args: {
    author: { name: 'Sofia Lindqvist', handle: 'sofialifts' },
    time: '2h',
  },
  decorators: [
    (Story) => (
      <View style={{ width: 360, maxWidth: '100%' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SocialPost>;

/** A simple inline engagement footer — in real apps consumers pass <EngagementBar/>. */
function FooterPlaceholder() {
  return (
    <View style={{ flexDirection: 'row', gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="star" size={16} color={colors.textDim} />
        <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>128</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={16} color={colors.textDim} />
        <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>24</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="share" size={16} color={colors.textDim} />
        <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>9</Text>
      </View>
    </View>
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
      <Card pad="md" flat style={{ backgroundColor: 'rgba(124,92,255,0.06)' }}>
        <Text style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, color: colors.accent2 }}>
          30-DAY ENERGY SUMMARY
        </Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 }}>
          Best month yet
        </Text>
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

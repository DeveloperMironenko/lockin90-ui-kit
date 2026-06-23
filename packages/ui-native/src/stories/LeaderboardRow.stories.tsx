import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { LeaderboardRow } from '../components/LeaderboardRow';

const meta = {
  title: 'Native/LeaderboardRow',
  component: LeaderboardRow,
  args: { rank: 1, name: 'Maya Kane', value: '1,240 pts' },
} satisfies Meta<typeof LeaderboardRow>;
export default meta;

type Story = StoryObj<typeof LeaderboardRow>;

const frame = {
  width: 340,
  padding: 6,
  backgroundColor: colors.glass2,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 18,
} as const;

/** Gold — the rank-1 entry shows a gold crown instead of the number. */
export const Gold: Story = {
  render: (args) => (
    <View style={frame}>
      <LeaderboardRow {...args} divider={false} />
    </View>
  ),
};

/** Podium — ranks 1–3 (gold / silver / bronze) plus the chasing pack. The
 *  first row sets `divider={false}` so the stack has no leading hairline. */
export const Podium: Story = {
  render: () => (
    <View style={frame}>
      <LeaderboardRow rank={1} name="Maya Kane" value="1,240 pts" sublabel="14-day streak" divider={false} />
      <LeaderboardRow rank={2} name="Leo Park" value="1,188 pts" sublabel="9-day streak" />
      <LeaderboardRow rank={3} name="Ada Reyes" value="1,102 pts" sublabel="11-day streak" />
      <LeaderboardRow rank={4} name="Sam Okafor" value="987 pts" />
      <LeaderboardRow rank={5} name="Nina Vogt" value="954 pts" />
    </View>
  ),
};

/** Highlighted — the current user's row, accent-tinted with a border. */
export const Highlighted: Story = {
  render: () => (
    <View style={frame}>
      <LeaderboardRow rank={5} name="Nina Vogt" value="954 pts" divider={false} />
      <LeaderboardRow rank={6} name="Theo Lund" value="921 pts" />
      <LeaderboardRow rank={7} name="You" value="903 pts" sublabel="top 12% of cohort" highlight />
      <LeaderboardRow rank={8} name="Ivy Chen" value="880 pts" />
    </View>
  ),
};

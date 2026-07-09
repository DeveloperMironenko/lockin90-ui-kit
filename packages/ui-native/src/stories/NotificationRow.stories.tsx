import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { NotificationRow } from '../components/NotificationRow';

const meta = {
  title: 'Native/NotificationRow',
  component: NotificationRow,
  args: { title: 'New insight ready', time: '2h' },
} satisfies Meta<typeof NotificationRow>;
export default meta;

type Story = StoryObj<typeof NotificationRow>;

export const Unread: Story = {
  args: {
    title: 'Energy trending up',
    time: '2h',
    body: 'Two solid nights of sleep lifted your recovery score.',
    unread: true,
    icon: 'sparkle',
  },
};

export const Read: Story = {
  args: {
    title: 'Weekly summary is ready',
    time: '1d',
    body: 'You logged three workouts and one recovery day.',
    icon: 'bell',
  },
};

export const NoIconNoBody: Story = {
  args: { title: 'Sync completed', time: '5m', unread: true },
};

/** A stack — mixed unread/read, with and without a body, all tappable. */
export const Feed: Story = {
  render: () => (
    <View
      style={{
        width: 340,
        backgroundColor: colors.glass2,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <NotificationRow
        title="Ada started following you"
        time="just now"
        unread
        icon="user"
        onPress={() => {}}
      />
      <NotificationRow
        title="You hit a 7-day streak"
        time="3h"
        body="Keep it going — one more day to your best week."
        unread
        icon="medal"
        onPress={() => {}}
      />
      <NotificationRow
        title="Sleep data synced"
        time="Yesterday"
        icon="sleep"
        onPress={() => {}}
      />
    </View>
  ),
};

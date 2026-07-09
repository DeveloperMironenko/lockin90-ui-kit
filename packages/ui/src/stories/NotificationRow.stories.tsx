import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationRow } from '../components/NotificationRow';

const meta = {
  title: 'Primitives/NotificationRow',
  component: NotificationRow,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NotificationRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unread: Story = {
  args: {
    title: 'New PR on Bench Press',
    time: '2h',
    body: 'You hit 102 kg — a new personal record. Nice work.',
    unread: true,
    icon: 'star',
    onClick: () => {},
  },
};

export const Read: Story = {
  args: {
    title: 'Weekly summary is ready',
    time: 'Yesterday',
    body: 'Your energy trended up 8% this week.',
    icon: 'mail',
    onClick: () => {},
  },
};

export const NoIconNoBody: Story = {
  args: { title: 'Sync completed', time: '5m', unread: true },
};

/* A stacked feed — adjacent rows draw a hairline between them. */
export const Feed: Story = {
  args: { title: 'New PR on Bench Press', time: '2h' },
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <NotificationRow title="New PR on Bench Press" time="2h" body="You hit 102 kg." unread icon="star" onClick={() => {}} />
      <NotificationRow title="Coach replied to your message" time="4h" body="Great progress — let's push the squat next." unread icon="mail" onClick={() => {}} />
      <NotificationRow title="Weekly summary is ready" time="Yesterday" icon="calendar" onClick={() => {}} />
      <NotificationRow title="Sync completed" time="2d" onClick={() => {}} />
    </div>
  ),
};

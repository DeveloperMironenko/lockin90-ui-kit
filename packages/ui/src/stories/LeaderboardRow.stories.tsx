import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LeaderboardRow } from '../components/LeaderboardRow';

const meta = {
  title: 'Primitives/LeaderboardRow',
  component: LeaderboardRow,
  args: { rank: 1, name: 'Maya Kane', value: '1,240 pts' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LeaderboardRow>;
export default meta;

type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: 360,
      padding: 6,
      background: 'var(--glass-2)',
      border: '1px solid var(--border)',
      borderRadius: 18,
    }}
  >
    {children}
  </div>
);

/** Gold — the rank-1 entry shows a gold crown instead of the number. */
export const Gold: Story = {
  render: (args) => (
    <Frame>
      <LeaderboardRow {...args} />
    </Frame>
  ),
};

/** Podium — ranks 1–3 (gold / silver / bronze) plus the chasing pack. */
export const Podium: Story = {
  render: () => (
    <Frame>
      <LeaderboardRow rank={1} name="Maya Kane" value="1,240 pts" sublabel="14-day streak" />
      <LeaderboardRow rank={2} name="Leo Park" value="1,188 pts" sublabel="9-day streak" />
      <LeaderboardRow rank={3} name="Ada Reyes" value="1,102 pts" sublabel="11-day streak" />
      <LeaderboardRow rank={4} name="Sam Okafor" value="987 pts" />
      <LeaderboardRow rank={5} name="Nina Vogt" value="954 pts" />
    </Frame>
  ),
};

/** Highlighted — the current user's row, accent-tinted with a border. */
export const Highlighted: Story = {
  render: () => (
    <Frame>
      <LeaderboardRow rank={5} name="Nina Vogt" value="954 pts" />
      <LeaderboardRow rank={6} name="Theo Lund" value="921 pts" />
      <LeaderboardRow rank={7} name="You" value="903 pts" sublabel="top 12% of cohort" highlight />
      <LeaderboardRow rank={8} name="Ivy Chen" value="880 pts" />
    </Frame>
  ),
};

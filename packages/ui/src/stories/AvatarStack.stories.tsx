import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarStack } from '../components/AvatarStack';

const ROSTER = [
  { name: 'Jamie Tan', gradient: 'var(--grad-mint)' },
  { name: 'Maya Kane', gradient: 'var(--grad-cta)' },
  { name: 'Avery Rhodes', gradient: 'var(--grad-warm)' },
  { name: 'Sam Vega', gradient: 'var(--grad-violet)' },
  { name: 'Priya Chen' },
  { name: 'Dan Morrow' },
  { name: 'Sara Kapoor' },
];

const meta = {
  title: 'Foundations/AvatarStack',
  component: AvatarStack,
  args: { avatars: ROSTER, max: 4, size: 32 },
} satisfies Meta<typeof AvatarStack>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithOverflow: StoryObj<typeof meta> = { args: { avatars: ROSTER, max: 3 } };

export const NoOverflow: StoryObj<typeof meta> = { args: { avatars: ROSTER.slice(0, 3), max: 4 } };

export const Large: StoryObj<typeof meta> = { args: { size: 48, max: 4 } };

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[24, 32, 44, 56].map((s) => (
        <AvatarStack key={s} avatars={ROSTER} max={4} size={s} />
      ))}
    </div>
  ),
};

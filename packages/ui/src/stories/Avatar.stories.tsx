import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Foundations/Avatar',
  component: Avatar,
  args: { name: 'Maya Kane', size: 48 },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;
export default meta;

export const Monogram: StoryObj<typeof meta> = {};

export const Rounded: StoryObj<typeof meta> = { args: { shape: 'rounded', size: 56 } };

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {[28, 36, 44, 56, 72].map((s) => (
        <Avatar key={s} name="Leo P" size={s} />
      ))}
    </div>
  ),
};

/** The AI coach (Aura) — an animated energy-spectrum flux orb. */
export const Aura: StoryObj<typeof meta> = { args: { variant: 'aura', name: 'Aura', size: 56 } };

export const AuraSizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {[28, 36, 44, 56, 72].map((s) => (
        <Avatar key={s} variant="aura" name="Aura" size={s} />
      ))}
    </div>
  ),
};

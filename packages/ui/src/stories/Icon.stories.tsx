import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from '../components/Icon';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  args: { name: 'share', size: 24 },
} satisfies Meta<typeof Icon>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

const ALL: IconName[] = [
  'back',
  'chevron',
  'share',
  'more',
  'lock',
  'play',
  'info',
  'timer',
  'plus',
  'check',
  'star',
];

export const AllIcons: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, color: 'var(--text)' }}>
      {ALL.map((name) => (
        <Icon key={name} name={name} size={24} />
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionBanner } from '../components/SessionBanner';
import { Icon } from '../components/Icon';

const meta: Meta<typeof SessionBanner> = {
  title: 'Primitives/SessionBanner',
  component: SessionBanner,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SessionBanner>;

export const Live: Story = {
  args: {
    title: 'Push Day A',
    status: 'Live · 24:18',
    subtitle: 'Bench Press · set 2 of 5',
    live: true,
    stats: [
      { value: '142', label: 'BPM' },
      { value: '12', label: 'Sets' },
      { value: '8 400', label: 'KG vol' },
    ],
    actions: [
      { label: 'Resume', variant: 'primary', onPress: () => {} },
      { label: 'Finish', variant: 'ghost', onPress: () => {} },
    ],
  },
};

export const Minimal: Story = {
  args: { title: 'Push Day A', status: 'Live · 02:41', live: true },
};

export const PausedSession: Story = {
  args: {
    title: 'Pull Day B',
    status: 'Paused · 31:07',
    subtitle: 'Barbell Row · set 4 of 4',
    actions: [{ label: 'Resume', variant: 'primary', onPress: () => {} }],
  },
};

export const WithLeading: Story = {
  args: {
    title: 'A very long session name that truncates before the status',
    status: 'Live · 1:02:44',
    live: true,
    leading: <Icon name="activity" size={16} />,
    subtitle: 'Cooldown · zone 1',
  },
};

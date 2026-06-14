import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionCard from './index';
import Button from '../Button';
import Chip from '../Chip';

const meta: Meta<typeof OptionCard> = {
  title: 'Onboarding/OptionCard',
  component: OptionCard,
  args: { title: 'Apple Watch', description: 'Heart rate, sleep & workouts' },
};
export default meta;

type Story = StoryObj<typeof OptionCard>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
      {/* (a) selectable choice */}
      <OptionCard title="Apple Watch" description="Heart rate, sleep & workouts" icon={<span>⌚️</span>} />
      <OptionCard
        title="Oura Ring"
        description="Sleep, readiness & recovery"
        icon={<span>💍</span>}
        selected
      />
      <OptionCard
        title="Garmin"
        description="Coming soon"
        icon={<span>🛰️</span>}
        disabled
      />
      {/* (b) actionable connect row */}
      <OptionCard
        title="WHOOP"
        description="Connect to import recovery"
        icon={<span>🟥</span>}
        trailing={<Button size="sm" variant="ghost">Connect</Button>}
      />
      <OptionCard
        title="Strava"
        description="Activity import"
        icon={<span>🟧</span>}
        trailing={<Chip tone="high" dot>connected</Chip>}
      />
    </div>
  ),
};

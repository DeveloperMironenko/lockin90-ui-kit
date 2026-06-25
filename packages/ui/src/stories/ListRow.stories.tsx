import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListRow } from '../components/ListRow';
import { Badge } from '../components/Toast';
import { Icon } from '../components/Icon';

const meta = {
  title: 'Primitives/ListRow',
  component: ListRow,
  args: { title: 'List item' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ListRow>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A picker — stacked rows with a leading letter badge + a trailing info icon. */
export const Picker: Story = {
  render: () => (
    <div style={{ width: 340, background: 'var(--glass-2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <ListRow leading={<Badge tone="low">W</Badge>} title="Warmup Set" trailing={<Icon name="info" />} />
      <ListRow
        leading={<Badge tone="mid">A</Badge>}
        title="Activation Drill"
        subtitle="Glute bridge · 2 × 12"
        trailing={<Icon name="info" />}
        active
      />
      <ListRow leading={<Badge tone="high">M</Badge>} title="Main Lift" trailing={<Icon name="info" />} />
      <ListRow leading={<Badge tone="neutral">C</Badge>} title="Cooldown" trailing={<Icon name="info" />} />
    </div>
  ),
};

/** Tappable rows — render as buttons with an onClick + a trailing chevron. */
export const Tappable: Story = {
  render: () => (
    <div style={{ width: 340, background: 'var(--glass-2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <ListRow
        title="Account"
        subtitle="Profile, email, password"
        trailing={<Icon name="chevron" />}
        onClick={() => {}}
      />
      <ListRow title="Notifications" trailing={<Icon name="chevron" />} onClick={() => {}} />
      <ListRow title="Delete account" trailing={<Icon name="chevron" />} onClick={() => {}} danger />
    </div>
  ),
};

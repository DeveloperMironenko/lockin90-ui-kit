import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { ListRow } from '../components/ListRow';
import { Badge } from '../components/Badge';
import { Icon } from '../components/Icon';

const meta = {
  title: 'Native/ListRow',
  component: ListRow,
  args: { title: 'List item' },
} satisfies Meta<typeof ListRow>;
export default meta;

type Story = StoryObj<typeof ListRow>;

/** A picker — stacked rows with a leading letter badge + a trailing info icon.
 *  The first row sets `divider={false}` so the stack has no leading hairline. */
export const Picker: Story = {
  render: () => (
    <View style={{ width: 320, backgroundColor: colors.glass2, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' }}>
      <ListRow
        leading={<Badge tone="low">W</Badge>}
        title="Warmup Set"
        trailing={<Icon name="info" color={colors.textFaint} />}
        divider={false}
      />
      <ListRow
        leading={<Badge tone="mid">A</Badge>}
        title="Activation Drill"
        subtitle="Glute bridge · 2 × 12"
        trailing={<Icon name="info" color={colors.textFaint} />}
        active
      />
      <ListRow
        leading={<Badge tone="high">M</Badge>}
        title="Main Lift"
        trailing={<Icon name="info" color={colors.textFaint} />}
      />
      <ListRow
        leading={<Badge tone="neutral">C</Badge>}
        title="Cooldown"
        trailing={<Icon name="info" color={colors.textFaint} />}
      />
    </View>
  ),
};

/** Tappable rows — render as Pressables with an onPress + a trailing chevron. */
export const Tappable: Story = {
  render: () => (
    <View style={{ width: 320, backgroundColor: colors.glass2, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' }}>
      <ListRow
        title="Account"
        subtitle="Profile, email, password"
        trailing={<Icon name="chevron" color={colors.textFaint} />}
        onPress={() => {}}
        divider={false}
      />
      <ListRow
        title="Notifications"
        trailing={<Icon name="chevron" color={colors.textFaint} />}
        onPress={() => {}}
      />
      <ListRow
        title="Delete account"
        trailing={<Icon name="chevron" color={colors.zoneLow} />}
        onPress={() => {}}
        danger
      />
    </View>
  ),
};

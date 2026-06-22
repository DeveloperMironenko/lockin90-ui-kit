import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { Icon, type IconName } from '../components/Icon';

const meta = { title: 'Native/Icon' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => <Icon name="share" size={24} color={colors.text} />,
};

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

export const AllIcons: StoryObj = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {ALL.map((name) => (
        <Icon key={name} name={name} size={24} color={colors.text} />
      ))}
    </View>
  ),
};

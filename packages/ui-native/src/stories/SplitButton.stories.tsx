import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SplitButton } from '../components/SplitButton';
import { Icon } from '../components/Icon';
import type { MenuItemData } from '../components/Menu';

const meta = { title: 'Native/SplitButton' } satisfies Meta;
export default meta;

type Story = StoryObj;

const items: MenuItemData[] = [
  { label: 'New page', icon: <Icon name="plus" size={15} /> },
  { label: 'Duplicate', icon: <Icon name="share" size={15} /> },
  { divider: true, label: '' },
  { label: 'Import from URL', icon: <Icon name="info" size={15} /> },
];

export const Default: Story = {
  render: () => (
    <View style={{ padding: 24 }}>
      <SplitButton label="Create page" variant="primary" icon={<Icon name="plus" size={15} color="#0A0A12" />} items={items} />
    </View>
  ),
};

export const Neutral: Story = {
  render: () => (
    <View style={{ padding: 24 }}>
      <SplitButton label="Add media" variant="default" items={items} />
    </View>
  ),
};

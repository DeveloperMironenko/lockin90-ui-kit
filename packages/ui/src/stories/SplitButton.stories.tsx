import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitButton } from '../components/SplitButton';
import { Icon } from '../components/Icon';
import type { MenuItemData } from '../components/Menu';

const meta = {
  title: 'Primitives/SplitButton',
  component: SplitButton,
} satisfies Meta<typeof SplitButton>;
export default meta;

const items: MenuItemData[] = [
  { label: 'New page', icon: <Icon name="plus" size={15} /> },
  { label: 'Duplicate', icon: <Icon name="share" size={15} /> },
  { divider: true, label: '' },
  { label: 'Import from URL', icon: <Icon name="info" size={15} /> },
];

export const Default: StoryObj<typeof meta> = {
  args: {
    label: 'Create page',
    variant: 'primary',
    icon: <Icon name="plus" size={15} />,
    items,
  },
};

export const Neutral: StoryObj<typeof meta> = {
  args: {
    label: 'Add media',
    variant: 'default',
    items,
  },
};

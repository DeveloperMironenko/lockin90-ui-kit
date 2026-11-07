import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { colors } from '@lockin90/tokens';
import { IconTile } from '../components/IconTile';

const meta = { title: 'Native/IconTile' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <IconTile icon="user" color={colors.accent} /> };

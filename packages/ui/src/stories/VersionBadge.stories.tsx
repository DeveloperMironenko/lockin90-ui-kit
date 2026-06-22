import type { Meta, StoryObj } from '@storybook/react-vite';
import { VersionBadge } from '../components/VersionBadge';

const meta = {
  title: 'Primitives/VersionBadge',
  component: VersionBadge,
} satisfies Meta<typeof VersionBadge>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { version: 'v1.6.0', build: 'a1b2c3d', env: 'prod' },
};

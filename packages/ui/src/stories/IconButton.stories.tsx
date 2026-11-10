import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '../components/IconButton';

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { label: 'Change photo', icon: 'camera' } };

export const SizesAndStates: StoryObj<typeof meta> = {
  args: { label: 'Change photo', icon: 'camera' },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton label="Change photo" icon="camera" />
      <IconButton label="Change photo" icon="camera" size="sm" />
      <IconButton label="Change photo" icon="camera" disabled />
    </div>
  ),
};

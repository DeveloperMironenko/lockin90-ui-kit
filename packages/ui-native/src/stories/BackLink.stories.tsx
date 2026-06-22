import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BackLink } from '../components/BackLink';

const meta = { title: 'Native/BackLink' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <BackLink />,
};

export const Custom: Story = {
  render: () => <BackLink label="Exercises" />,
};

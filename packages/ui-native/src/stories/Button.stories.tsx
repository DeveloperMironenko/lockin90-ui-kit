import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

const meta = { title: 'Native/Button' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Sso: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button variant="ghost" leading={<Icon name="google" size={18} />} title="Continue with Google" />
      <Button variant="ghost" leading={<Icon name="apple" size={18} />} title="Continue with Apple" />
    </View>
  ),
};

export const Primary: Story = {
  render: () => <Button variant="primary" title="Log check-in" />,
};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button variant="primary" title="Log check-in" />
      <Button variant="default" title="View history" />
      <Button variant="ghost" title="Cancel" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Button variant="primary" size="sm" title="Small" />
      <Button variant="primary" size="md" title="Medium" />
    </View>
  ),
};

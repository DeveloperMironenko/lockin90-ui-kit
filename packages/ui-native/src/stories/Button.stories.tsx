import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

const meta = { title: 'Native/Button' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Button variant="primary" title="Log check-in" />,
};

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

/** `trailing` icon slot — e.g. a forward/arrow CTA. Symmetric with `leading`. */
export const Trailing: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button variant="primary" trailing={<Icon name="arrow-right" size={18} color="#0A0A12" />} title="Get started" />
      <Button
        leading={<Icon name="data-source" size={18} />}
        trailing={<Icon name="arrow-right" size={18} />}
        title="Connect a source"
      />
    </View>
  ),
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

/** `tone="danger"` — solid `colors.bad` fill on the default button, red-tinted
 *  transparent on `ghost` (the account "danger zone" delete). */
export const Danger: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button tone="danger" leading={<Icon name="trash" size={16} color="#0A0A12" />} title="Delete account" />
      <Button variant="ghost" tone="danger" title="Delete account" />
    </View>
  ),
};

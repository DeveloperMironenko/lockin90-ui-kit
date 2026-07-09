import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors } from '@lockin90/tokens';
import { Card } from '../components/Card';

const meta = { title: 'Native/Card' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card>
      <Text style={{ color: '#fff' }}>Glass card surface</Text>
    </Card>
  ),
};

export const Lit: Story = {
  render: () => (
    <Card lit>
      <Text style={{ color: '#fff' }}>Lit hairline on the top edge</Text>
    </Card>
  ),
};

export const WarnTone: Story = {
  render: () => (
    <Card tone="warn">
      <Text style={{ color: '#fff' }}>Your subscription renews in 3 days</Text>
    </Card>
  ),
};

export const DangerTone: Story = {
  render: () => (
    <Card tone="danger">
      <Text style={{ color: '#fff' }}>Payment failed — update your card to keep your data</Text>
    </Card>
  ),
};

export const Dashed: Story = {
  render: () => (
    <Card variant="dashed">
      <Text style={{ color: colors.textDim }}>+ Connect a data source</Text>
    </Card>
  ),
};

export const Ghost: Story = {
  render: () => (
    <Card variant="ghost">
      <Text style={{ color: '#fff' }}>Borderless transparent surface</Text>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 12, width: 320 }}>
      <Card lit>
        <Text style={{ color: '#fff' }}>Lit hairline on the top edge</Text>
      </Card>
      <Card padLg>
        <Text style={{ color: '#fff' }}>Larger padding</Text>
      </Card>
      <Card flat>
        <Text style={{ color: '#fff' }}>Flat — no elevation shadow</Text>
      </Card>
    </View>
  ),
};

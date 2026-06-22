import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
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

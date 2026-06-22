import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Ring } from '../components/Ring';

const meta = { title: 'Native/Ring' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Ring value={72} size={88} />,
};

export const Gradient: Story = {
  render: () => <Ring value={84} size={88} gradient={['#7C5CFF', '#A8FF35']} />,
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
      <Ring size={64} value={40} color="#FF4D6D" thickness={5} />
      <Ring size={90} value={64} color="#22D3EE" thickness={6} />
      <Ring size={120} value={88} color="#34F5C5" thickness={8} />
    </View>
  ),
};

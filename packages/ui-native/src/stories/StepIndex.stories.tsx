import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StepIndex } from '../components/StepIndex';

const meta = { title: 'Native/StepIndex' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Steps: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <StepIndex step={1} />
      <StepIndex step={2} done />
    </View>
  ),
};

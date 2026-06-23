import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Hypnogram } from '../components/Hypnogram';

const meta = { title: 'Native/Hypnogram' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram />
    </View>
  ),
};

export const NoLabels: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram showStageLabels={false} />
    </View>
  ),
};

export const Short: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram
        segments={[
          { stage: 'awake', minutes: 8 },
          { stage: 'light', minutes: 42 },
          { stage: 'deep', minutes: 55 },
          { stage: 'rem', minutes: 22 },
          { stage: 'light', minutes: 30 },
        ]}
        axis={['11p', '12a', '1a']}
      />
    </View>
  ),
};

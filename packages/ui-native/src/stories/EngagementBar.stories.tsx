import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { EngagementBar } from '../components/EngagementBar';

const meta = { title: 'Native/EngagementBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <EngagementBar
        like={{ count: 128, active: false }}
        comment={{ count: 24 }}
        share={{}}
        save={{ active: false }}
      />
    </View>
  ),
};

export const LikedAndSaved: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <EngagementBar
        like={{ count: 342, active: true }}
        comment={{ count: 57 }}
        share={{}}
        save={{ active: true }}
      />
    </View>
  ),
};

export const MinimalLikeOnly: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <EngagementBar like={{ count: 96, active: false }} />
    </View>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TagCloud, type TagCloudItem } from '../components/TagCloud';

const meta = { title: 'Native/TagCloud' } satisfies Meta;
export default meta;

type Story = StoryObj;

const TAGS: TagCloudItem[] = [
  { label: '#sleep', weight: 4 },
  { label: 'focused', weight: 3 },
  { label: '#training', weight: 2 },
  { label: '#recovery', weight: 3 },
  { label: 'restless', weight: 1 },
  { label: '#work', weight: 2 },
  { label: 'grateful', weight: 4 },
  { label: '#caffeine', weight: 1 },
  { label: 'overwhelmed', weight: 2 },
  { label: 'strong', weight: 3 },
  { label: '#hydration', weight: 1 },
  { label: 'drained', weight: 2 },
  { label: '#focus', weight: 1 },
  { label: 'calm', weight: 2 },
];

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagCloud tags={TAGS} />
    </View>
  ),
};

export const Gradient: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagCloud tags={TAGS} colorMode="gradient" />
    </View>
  ),
};

export const Interactive: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagCloud
        tags={TAGS}
        colorMode="gradient"
        onTagPress={(tag) => console.log(`Tapped ${tag.label}`)}
      />
    </View>
  ),
};

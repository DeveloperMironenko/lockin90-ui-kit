import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagCloud, type TagCloudItem } from '../components/TagCloud';

const meta = {
  title: 'Primitives/TagCloud',
  component: TagCloud,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TagCloud>;
export default meta;

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

export const Default: StoryObj<typeof meta> = {
  args: { tags: TAGS },
};

export const Gradient: StoryObj<typeof meta> = {
  args: { tags: TAGS, colorMode: 'gradient' },
};

export const Interactive: StoryObj<typeof meta> = {
  args: {
    tags: TAGS,
    colorMode: 'gradient',
    onTagPress: (tag) => alert(`Tapped ${tag.label}`),
  },
};

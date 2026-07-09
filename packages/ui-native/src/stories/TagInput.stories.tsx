import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TagInput, CodeInput } from '../components/TagInput';

const meta = { title: 'Native/TagInput' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagInput />
    </View>
  ),
};

export const Seeded: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagInput tags={['focus', 'energy', 'morning']} placeholder="Add a tag…" />
    </View>
  ),
};

export const Invalid: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TagInput invalid tags={['sleep', 'recovery']} />
    </View>
  ),
};

export const Code: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <CodeInput />
      <CodeInput length={4} value="12" />
    </View>
  ),
};

export const CodeInvalid: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeInput value="123456" invalid />
    </View>
  ),
};

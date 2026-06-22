import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Eyebrow } from '../components/Eyebrow';

const meta = { title: 'Native/Eyebrow' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Eyebrow>Generated · 6</Eyebrow>,
};

export const SectionHeader: Story = {
  render: () => (
    <View style={{ gap: 6 }}>
      <Eyebrow>Targets</Eyebrow>
      <Text style={{ color: '#EEF1F8', fontSize: 20, fontWeight: '700' }}>Publish destinations</Text>
    </View>
  ),
};

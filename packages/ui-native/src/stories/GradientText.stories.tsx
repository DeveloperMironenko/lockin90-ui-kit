import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { GradientText } from '../components/GradientText';

const meta = { title: 'Native/GradientText' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => <GradientText style={{ fontSize: 28, fontWeight: '700' }}>LockIn90</GradientText>,
};

export const Variants: StoryObj = {
  render: () => (
    <View style={{ gap: 12 }}>
      <GradientText gradient="flux" style={{ fontSize: 24, fontWeight: '700' }}>
        Flux
      </GradientText>
      <GradientText gradient="cta" style={{ fontSize: 24, fontWeight: '700' }}>
        CTA
      </GradientText>
      <GradientText gradient="violet" style={{ fontSize: 24, fontWeight: '700' }}>
        Violet
      </GradientText>
    </View>
  ),
};

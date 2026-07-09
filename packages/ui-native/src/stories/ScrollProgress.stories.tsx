import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ScrollView, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { ScrollProgress, type ScrollProgressGradient } from '../components/ScrollProgress';

const meta = { title: 'Native/ScrollProgress' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** Scrollable stage — the host wires `progress` from the ScrollView's onScroll,
 *  which is exactly how an app screen consumes it (native scroll is imperative,
 *  unlike the web twin that tracks the window itself). */
function Stage({ gradient = 'cta', height = 3 }: { gradient?: ScrollProgressGradient; height?: number }) {
  const [progress, setProgress] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollable = contentSize.height - layoutMeasurement.height;
    setProgress(scrollable > 0 ? contentOffset.y / scrollable : 0);
  };

  return (
    <View
      style={{
        height: 420,
        borderRadius: radii.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bg1,
      }}
    >
      <ScrollProgress progress={progress} gradient={gradient} height={height} />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: '700', color: colors.text }}>
          Scroll this article
        </Text>
        {Array.from({ length: 14 }).map((_, i) => (
          <Text key={i} style={{ color: colors.textDim, fontFamily: fonts.ui, fontSize: 13, lineHeight: 21 }}>
            Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

export const Default: Story = { render: () => <Stage gradient="cta" height={3} /> };

export const Flux: Story = { render: () => <Stage gradient="flux" height={4} /> };

export const Mint: Story = { render: () => <Stage gradient="mint" height={3} /> };

export const Violet: Story = { render: () => <Stage gradient="violet" height={3} /> };

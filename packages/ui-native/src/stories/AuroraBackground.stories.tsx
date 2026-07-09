import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { AuroraBackground, type AuroraBackgroundProps } from '../components/AuroraBackground';

const meta = { title: 'Native/AuroraBackground' } satisfies Meta;
export default meta;

type Story = StoryObj;

// The backdrop is absolute-fill, so frame it in a tall, void-colored stage
// with foreground content above it (mirrors the web story's Stage).
function Stage(props: AuroraBackgroundProps) {
  return (
    <View
      style={{
        minHeight: 460,
        overflow: 'hidden',
        borderRadius: radii.lg,
        backgroundColor: colors.bg0,
      }}
    >
      <AuroraBackground {...props} />
      <View style={{ flex: 1, minHeight: 460, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 34,
            fontWeight: '700',
            letterSpacing: -0.7,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          Aurora Flux
        </Text>
        <Text
          style={{ marginTop: 8, color: colors.textDim, fontFamily: fonts.ui, fontSize: 13, textAlign: 'center' }}
        >
          Drifting energy-spectrum blobs + grid veil, behind your content.
        </Text>
      </View>
    </View>
  );
}

export const Default: Story = { render: () => <Stage /> };

export const Subtle: Story = { render: () => <Stage variant="subtle" /> };

export const Vivid: Story = { render: () => <Stage variant="vivid" /> };

export const NoGrid: Story = { render: () => <Stage grid={false} /> };

/** Reduced-motion / snapshot-friendly: blobs hold still. */
export const Still: Story = { render: () => <Stage still /> };

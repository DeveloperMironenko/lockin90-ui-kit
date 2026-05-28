import React from 'react';
import { View, Text } from 'react-native';
import { colors, fonts } from '@p90/tokens';

interface Props {
  size?: number;
  showWordmark?: boolean;
}

export default function BrandMark({ size = 120, showWordmark = true }: Props) {
  // Slash extends well past both edges, like the reference logo
  const slashWidth = size * 2.2;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{
          fontFamily: fonts.displayBlackItalic,
          fontSize: size,
          lineHeight: size,
          color: colors.textPrimary,
          letterSpacing: -size * 0.02,
          paddingRight: size * 0.12,
        }}>90</Text>
        {/* Slash — centered on the "90", extends left and right like the reference */}
        <View style={{
          position: 'absolute',
          width: slashWidth,
          height: Math.max(2, size * 0.022),
          backgroundColor: colors.accent,
          transform: [{ rotate: '-12deg' }],
        }} />
      </View>
      {showWordmark && (
        <Text style={{
          fontFamily: fonts.displayBoldItalic,
          fontSize: size * 0.14,
          letterSpacing: size * 0.14 * 0.32,
          color: colors.textPrimary,
          marginTop: 6,
          textTransform: 'uppercase',
        }}>PERFORMANCE</Text>
      )}
    </View>
  );
}

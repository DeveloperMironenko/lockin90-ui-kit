import React from 'react';
import { View, type DimensionValue } from 'react-native';
import { colors } from '@lockin90/tokens';

interface Props {
  width?: DimensionValue;
  thickness?: number;
  angle?: number;
  color?: string;
}

export default function Slash({ width = 80, thickness = 2, angle = -8, color }: Props) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width,
        height: thickness,
        backgroundColor: color ?? colors.accent,
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

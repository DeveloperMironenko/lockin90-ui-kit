import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

interface Props {
  score?: number;
  size?: number;
}

export default function MiniEnergyRing({ score = 72, size = 56 }: Props) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 100));
  const arcColor = score >= 67 ? colors.zoneHigh : score >= 34 ? colors.zoneMid : colors.zoneLow;

  const zoneLabel = score >= 67 ? 'high' : score >= 34 ? 'moderate' : 'low';
  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Energy ${score}, ${zoneLabel} zone`}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#1A1A1A" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={arcColor} strokeWidth={stroke} fill="none"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </Svg>
      {/* Red slash (decorative) */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          top: size * 0.52,
          left: 0,
          width: size * 1.12,
          height: 1.5,
          backgroundColor: colors.accent,
          opacity: 0.8,
          transform: [{ rotate: '-12deg' }],
          transformOrigin: '0% 50%',
        } as any}
      />
      {/* Score */}
      <View style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontFamily: fonts.displayItalic,
          fontSize: size * 0.34,
          lineHeight: size * 0.34,
          color: colors.textPrimary,
        }}>{score}</Text>
      </View>
    </View>
  );
}

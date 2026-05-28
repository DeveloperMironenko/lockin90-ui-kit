import React from 'react';
import { Text, type TextStyle } from 'react-native';
import { colors, fonts, fontSizes, letterSpacing } from '@p90/tokens';

type EyebrowColor = 'secondary' | 'accent' | 'muted';
const EYEBROW_COLORS: Record<EyebrowColor, string> = {
  secondary: colors.textSecondary, accent: colors.accent, muted: colors.textMuted,
};

export function Eyebrow({ children, color = 'secondary', style }: { children: React.ReactNode; color?: EyebrowColor; style?: TextStyle }) {
  return (
    <Text style={[{
      fontFamily: fonts.displayBold,
      fontSize: 11,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: EYEBROW_COLORS[color],
    }, style]}>{children}</Text>
  );
}

type MonoColor = 'secondary' | 'accent' | 'muted' | 'white';
const MONO_COLORS: Record<MonoColor, string> = {
  secondary: colors.textSecondary, accent: colors.accent, muted: colors.textMuted, white: colors.textPrimary,
};

export function Mono({ children, color = 'muted', style }: { children: React.ReactNode; color?: MonoColor; style?: TextStyle }) {
  return (
    <Text style={[{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.4, color: MONO_COLORS[color] }, style]}>
      {children}
    </Text>
  );
}

export function Caption({ children, color = 'muted', style }: { children: React.ReactNode; color?: 'muted' | 'secondary' | 'white'; style?: TextStyle }) {
  const c = color === 'white' ? colors.textPrimary : color === 'secondary' ? colors.textSecondary : colors.textMuted;
  return <Text style={[{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: letterSpacing.eyebrow, color: c }, style]}>{children}</Text>;
}

export function Body({ children, size = 'sm', color = 'secondary', style }: { children: React.ReactNode; size?: 'sm' | 'base'; color?: 'secondary' | 'muted' | 'white'; style?: TextStyle }) {
  const c = color === 'white' ? colors.textPrimary : color === 'muted' ? colors.textMuted : colors.textSecondary;
  const fs = size === 'base' ? fontSizes.base : fontSizes.sm;
  return <Text style={[{ fontFamily: fonts.ui, fontSize: fs, lineHeight: fs * 1.55, color: c }, style]}>{children}</Text>;
}

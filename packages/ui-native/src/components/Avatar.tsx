import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

export interface AvatarProps {
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name = '', size = 38, style }: AvatarProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.display,
    color: '#07080d',
  },
});

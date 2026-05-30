import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

type BadgeVariant = 'muted' | 'active' | 'danger';

const COLOR: Record<BadgeVariant, string> = {
  muted: colors.textMuted, active: colors.accent, danger: colors.accent,
};
const DOT: Record<BadgeVariant, string> = {
  muted: colors.textMuted, active: colors.accent, danger: colors.accent,
};

export function Badge({ children, variant = 'muted', dot = false }: { children: React.ReactNode; variant?: BadgeVariant; dot?: boolean }) {
  return (
    <View style={styles.row}>
      {dot && <View style={[styles.dot, { backgroundColor: DOT[variant] }]} />}
      <Text style={[styles.text, { color: COLOR[variant] }]}>{children}</Text>
    </View>
  );
}

export function PulseDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.pulse, { opacity }]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase' },
  pulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
});
